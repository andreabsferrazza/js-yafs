class yafs{
	static create_subsequence_pattern(needle,gaps_threshold){
		let gap = ".{0,"+gaps_threshold+"}";
		let pattern = gap;
		for(let i=0;i<needle.length;i++){
			pattern=pattern+needle[i]+gap;
		}
		pattern=pattern+gap;
		return new RegExp(pattern);
	}
	static subsequence_match(needle,haystack,gaps_threshold,case_sensitive=0){
		// given a needle returns true if all the letters of the needle appears in the same order somewhere in the haystack, ignoring any other characters in between them
		if( typeof needle !== "string" || typeof haystack !== "string"){
			return -1;
		}
		if( needle.length <= 0 || haystack.length <= 0 ){
			return -2;
		}
		if(case_sensitive===0){
			needle=needle.toLowerCase();
			haystack=haystack.toLowerCase();
		}
		needle = needle.replace(/[^a-zA-Z0-9']/g,"");
		const pattern = yafs.create_subsequence_pattern(needle,gaps_threshold);
		return haystack.match(pattern)===null ? 0 : 1;

	}
	static levenshtein(a,b){
		if( typeof a !== "string" || typeof b !== "string"){
			return -1;
		}
		if( a.length <= 0 || b.length <= 0 ){
			return -2;
		}
		if( a.length==b.length ){
			return this.hamming(a,b);
		}
		let distance = 0;
		/* Let's create the array to hold distances. +1 because we need to know the base distances */
		const dp = Array.from({ length: a.length +1 });
		for(let i=0;i<=a.length;i++){
			dp[i]= Array.from({ length: b.length +1 });
			for(let j=0;j<=b.length;j++){
				dp[i][j]=0;
			}
		}
		for(let i=0;i<=a.length;i++){
			dp[i][0]=i;
		}
		for(let j=0;j<=b.length;j++){
			dp[0][j]=j;
		}
		/* Alternative initialization
		const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));*/

		/* We start from 1 because 0 contains the base distances from letters */
		for(let i=1;i<=a.length;i++){
			for(let j=1;j<=b.length;j++){
				/* console.log(dp[i][j]+" <- "+dp[i][j-1]+" ^ "+dp[i-1][j]+" \\ "+dp[i-1][j-1]); */
				let delta = 0;
				if(a[i-1]!==b[j-1]){
					delta = 1;
				}
				let min=dp[i-1][j-1]+delta;
				if(dp[i-1][j]<min){
					min=dp[i-1][j]+1;
				}
				if(dp[i][j-1]<min){
					min=dp[i][j-1]+1;
				}
				dp[i][j]=min;
				/* console.log("ai = "+a[i-1]+" | bj = "+b[j-1]+" delta = "+delta+" min = "+min); */
			}
		}
		distance = dp[a.length][b.length];
		return distance;
	}
	static hamming(a,b){
		if( typeof a !== "string" || typeof b !== "string"){
			return -1;
		}
		if( a.length === 0 || b.length === 0){
			return -2;
		}
		if( a.length!=b.length ){
			return -3;
		}
		let distance = 0;
		for(let i=0; i<a.length; i++){
			if(a[i]!=b[i]){
				distance++;
			}
		}
		return distance;
	}
	static search_levenshstein(needle,haystack,threshold=0,case_sensitive=0){
		/* -1 means error */
		if( typeof needle !== "string" || typeof haystack !== "string" || typeof threshold !== "number" || threshold<0 || needle.length === 0 || haystack.length === 0){
			return {
				needle: needle,
				haystack: haystack,
				threshold: threshold,
				distances: null,
				haystack_vector: null,
				found: -1
			};
		}
		needle = yafs.clean(needle,case_sensitive);
		haystack = yafs.clean(haystack,case_sensitive);
		// we compute distances between words in needle and words in haystack
		const keys = needle.split(" ");
		const words = haystack.split(" ");
		let found=0;
		let distances=Array.from({ length: keys.length });
		for(let i=0;i<keys.length;i++){
			distances[i]= Array.from({ length: words.length });
			for(let j=0;j<words.length;j++){
				distances[i][j]=0;
			}
		}
		// this is a characteristic vector, 1 when a word match according to the threshold 0 else
		var haystack_vector=Array.from({ length: words.length });
		for(let i=0;i<haystack_vector.length;i++){
			haystack_vector[i]=0;
		}
		for(let i=0;i<keys.length;i++){
			for(let j=0;j<words.length;j++){
				let ok=0;
				let distance = this.levenshtein(keys[i],words[j]);
				if(distance<0){
					// error found
					return {
						needle: needle,
						haystack: haystack,
						threshold: threshold,
						distances: distances,
						haystack_vector: haystack_vector,
						found: -2
					};
				}
				if(distance<=threshold){
					ok=1;
				}
				distances[i][j]=distance;
				if(ok>0){
					haystack_vector[j]++;
				}
				found+=ok;
			}
		}
		return {
			needle: needle,
			haystack: haystack,
			threshold: threshold,
			distances: distances,
			haystack_vector: haystack_vector,
			found: found
		};
	}
	static search_numbers_included(needle,haystack,max_keys=1){
		/* -1 means error */
		if( typeof needle !== "string" || typeof haystack !== "string" || needle.length === 0 || haystack.length === 0){
			return {
				needle: needle,
				haystack: haystack,
				haystack_vector: null,
				found: -1
			};
		}
		needle = yafs.clean(needle);
		haystack = yafs.clean(haystack);
		// we look for numbers contained in needle in words in haystack
		const keys = needle.split(" ");
		const words = haystack.split(" ");
		let found=0;
		// this is a characteristic vector, 1 when a number is contained in a word of haystack
		var haystack_vector=Array.from({ length: words.length });
		for(let i=0;i<haystack_vector.length;i++){
			haystack_vector[i]=0;
		}
		for(let i=0;i<keys.length;i++){
			for(let j=0;j<words.length;j++){
				let ok=0;
				// we check if the word is a number
				if(keys[i].match(/^[0-9]+$/)!==null && keys.length<=max_keys){
					// max_keys is the maximum number of words that the needle must have
					if(yafs.searchIncluded(keys[i],words[j]).found>0){
						ok=1;
					}else{
						ok=0;
					}
				}
				if(ok>0){
					haystack_vector[j]++;
				}
				found+=ok;
			}
		}
		return {
			needle: needle,
			haystack: haystack,
			max_keys: max_keys,
			haystack_vector: haystack_vector,
			found: found
		};
	}
	static search_subsequence(needle,haystack){
		/* -1 means error */
		if( typeof needle !== "string" || typeof haystack !== "string" || typeof threshold !== "number" || needle.length === 0 || haystack.length === 0){
			return {
				needle: needle,
				haystack: haystack,
				found: -1
			};
		}
		let subsequence_found = yafs.subsequence_match(needle,haystack,999);
		if(subsequence_found<0){
			return {
				needle: needle,
				haystack: haystack,
				found: -2
			};
		}
		return {
			needle: needle,
			haystack: haystack,
			found: subsequence_found
		};
	}
	static clean(str,case_sensitive=1){
		if(typeof str !== "string"){
			return "";
		}
		str = str.replace(/[^a-zA-Z0-9']/g," ");
		str = str.replace(/[\s]{2,}/g," ");
		if(case_sensitive===0){
			str = str.toLowerCase();
		}
		str = str.trim();
		return str;
	}
	static searchIncluded(needle,haystack){
		/* -1 means error */
		if( typeof needle !== "string" || typeof haystack !== "string" || needle.length === 0 || haystack.length === 0){
			return {
				needle: needle,
				haystack: haystack,
				haystack_vector: null,
				found: -1
			};
		}
		const keys = needle.split(" ");
		const words = haystack.split(" ");
		var found=0;
		var haystack_vector=Array.from({ length: words.length });
		for(let i=0;i<haystack_vector.length;i++){
			haystack_vector[i]=0;
		}
		for(let i=0;i<keys.length;i++){
			for(let j=0;j<words.length;j++){
				let distance = this.levenshtein(keys[i],words[j]);
				if(words[j].includes(keys[i])){
					found++;
					haystack_vector[j]++;
				}
			}
		}
		return {
			needle: needle,
			haystack: haystack,
			haystack_vector: haystack_vector,
			found: found
		};
	}
}

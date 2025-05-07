
class yafs{
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
	static search(needle,haystack,threshold=0){
		/* -1 means error */
		if( typeof needle !== "string" || typeof haystack !== "string" || typeof threshold !== "number" || needle.length === 0 || haystack.length === 0){
			return {
				needle: needle,
				haystack: haystack,
				threshold: threshold,
				distances: null,
				haystack_vector: null,
				found: -1
			};
		}
		const keys = needle.split(" ");
		const words = haystack.split(" ");
		var found=0;
		var distances=Array.from({ length: keys.length });
		for(let i=0;i<keys.length;i++){
			distances[i]= Array.from({ length: words.length });
			for(let j=0;j<words.length;j++){
				distances[i][j]=0;
			}
		}
		var haystack_vector=Array.from({ length: words.length });
		for(let i=0;i<haystack_vector.length;i++){
			haystack_vector[i]=0;
		}
		for(let i=0;i<keys.length;i++){
			for(let j=0;j<words.length;j++){
				let distance = this.levenshtein(keys[i],words[j]);
				if(distance<=threshold){
					found++;
					haystack_vector[j]++;
				}
				distances[i][j]=distance;
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

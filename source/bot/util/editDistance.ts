export function calculateEditDistance(str1: string, str2: string): number {
    let m = str1.length, n = str2.length
    let d = Array(m + 1).fill(0).map(() => Array(n + 1))

    if (m == 0 || n == 0) return Math.max(m, n)

    for (let i = 0; i <= m; i++)
        d[i][0] = i
    for (let i = 0; i <= n; i++)
        d[0][i] = i
    
    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
            if (str1[i - 1] === str2[j - 1])
                d[i][j] = d[i - 1][j - 1]
            else {
                d[i][j] = Math.min(
                    d[i - 1][j] + 1,
                    d[i][j - 1] + 1,
                    d[i - 1][j - 1] + 1
                )
            }
        }
    }

    return d[m][n]
}
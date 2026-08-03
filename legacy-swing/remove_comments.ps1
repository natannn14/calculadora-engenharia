$files = Get-ChildItem -Path src -Filter *.java -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    
    $newContent = @()
    foreach ($line in $content) {
        if ($line.Trim().StartsWith("//")) {
            continue
        }
        
        $newLine = $line -replace '\s*//.*$', ''
        $newContent += $newLine
    }
    
    Set-Content -Path $file.FullName -Value $newContent
}

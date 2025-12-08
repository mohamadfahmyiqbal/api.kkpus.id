param(
    [string]$Path = ".",
    [string[]]$Exclude = @("node_modules","routes copy","controllers copy","models copy")
)

function Show-Tree {
    param($CurrentPath, $Prefix)

    # Ambil folder dan file
    $items = Get-ChildItem -LiteralPath $CurrentPath -Force -ErrorAction SilentlyContinue |
        Where-Object { $Exclude -notcontains $_.Name } |
        Sort-Object Name

    for ($i = 0; $i -lt $items.Count; $i++) {

        $isLast = ($i -eq $items.Count - 1)
        $connector = if ($isLast) { "\-- " } else { "|-- " }

        Write-Output "$Prefix$connector$($items[$i].Name)"

        # Jika folder, lanjutkan rekursi
        if ($items[$i].PSIsContainer) {
            $nextPrefix = if ($isLast) { "$Prefix    " } else { "$Prefix|   " }
            Show-Tree -CurrentPath $items[$i].FullName -Prefix $nextPrefix
        }
    }
}

# Tampilkan root
Write-Output (Resolve-Path $Path).ProviderPath
Show-Tree -CurrentPath (Resolve-Path $Path).ProviderPath -Prefix ""

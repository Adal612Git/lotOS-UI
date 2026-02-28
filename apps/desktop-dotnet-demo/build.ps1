$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

dotnet publish -c Release -r win-x64 --self-contained false -o .\publish

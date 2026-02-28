$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

javac App.java
jar --create --file LotosDesktopJavaDemo.jar --main-class App App.class

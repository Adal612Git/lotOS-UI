# LotOS UI Java Desktop Demo

This demo is a real Java desktop shell built with Swing.

## What it includes

- KPI stat cards
- runtime delivery table
- action button
- modal dialog

## Run locally

```bash
javac App.java
java App
```

## Package a JAR

```bash
javac App.java
jar --create --file LotosDesktopJavaDemo.jar --main-class App App.class
java -jar LotosDesktopJavaDemo.jar
```

## Build script

```powershell
./build.ps1
```

Note:

The simplest direct run is `java App`.
The JAR command above is kept in CI as a packaging checkpoint.

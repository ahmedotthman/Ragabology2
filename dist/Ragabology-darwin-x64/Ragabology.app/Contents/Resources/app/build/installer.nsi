!include "MUI2.nsh"

; Define the names, directories, and executable
!define APP_NAME "Sobeh Online"
!define APP_EXECUTABLE "Sobeh.exe"
!ifndef BUILD_DIR
  !define BUILD_DIR "C:\Users\ahmed\OneDrive\Desktop\Techbox\Desktop-EDU\my-electron-app\dist\win-unpacked"
!endif

!ifndef RESOURCES_DIR
  !define RESOURCES_DIR "C:\Users\ahmed\OneDrive\Desktop\Techbox\Desktop-EDU\my-electron-app\build"
!endif

; Request admin rights for installation
RequestExecutionLevel admin

; UI configuration
!define MUI_ABORTWARNING

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"


Section "Install"
  SetOutPath "$INSTDIR"
  File /r "${BUILD_DIR}\*.*" ; Copy the application files
  
  ; Create the application shortcut
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE}"
  
  ; Generate the uninstaller executable
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  ; Remove the application files
  Delete "$INSTDIR\*.*"
  RMDir "$INSTDIR"
  
  ; Remove the shortcut
  Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\${APP_NAME}"
SectionEnd

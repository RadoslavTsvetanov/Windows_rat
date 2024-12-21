package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/sys/windows"
	"golang.org/x/sys/windows/registry"
)

func main() {
	// Step 1: Download the script
	remoteURL := "https://example.com/script.bat" // Replace with the actual URL
	fileName := "downloaded_script.bat"

	err := downloadFile(remoteURL, fileName)
	if err != nil {
		fmt.Printf("Error downloading file: %v\n", err)
		return
	}
	fmt.Println("File downloaded successfully.")

	// Step 2: Prompt user for target directory
	fmt.Print("Enter the target directory to move the script: ")
	var targetDir string
	fmt.Scanln(&targetDir)

	// Validate and move file
	err = moveFile(fileName, targetDir)
	if err != nil {
		fmt.Printf("Error moving file: %v\n", err)
		return
	}
	fmt.Printf("File moved to %s successfully.\n", targetDir)

	// Step 3: Create a registry key
	keyPath := `SOFTWARE\MyApp`
	newKey, _, err := registry.CreateKey(registry.LOCAL_MACHINE, keyPath, registry.ALL_ACCESS)
	if err != nil {
		fmt.Printf("Error creating registry key: %v\n", err)
		return
	}
	defer newKey.Close()

	// Set a sample value
	err = newKey.SetStringValue("ScriptPath", filepath.Join(targetDir, fileName))
	if err != nil {
		fmt.Printf("Error setting registry value: %v\n", err)
		return
	}
	fmt.Println("Registry key and value created successfully.")

	// Step 4: Grant admin privileges to the registry key
	err = grantAdminPrivileges(keyPath)
	if err != nil {
		fmt.Printf("Error granting admin privileges: %v\n", err)
		return
	}
	fmt.Println("Admin privileges granted to the registry key.")
}

// Function to download a file from a URL
func downloadFile(url, fileName string) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(fileName)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer out.Close()

	// Write response to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return fmt.Errorf("failed to copy response body: %v", err)
	}

	return nil
}

// Function to move a file to a target directory
func moveFile(fileName, targetDir string) error {
	// Ensure the target directory exists
	if _, err := os.Stat(targetDir); os.IsNotExist(err) {
		return fmt.Errorf("target directory does not exist")
	}

	// Move the file
	targetPath := filepath.Join(targetDir, filepath.Base(fileName))
	err := os.Rename(fileName, targetPath)
	if err != nil {
		return fmt.Errorf("failed to move file: %v", err)
	}
	return nil
}

// Function to grant admin privileges to a registry key
func grantAdminPrivileges(keyPath string) error {
	// Convert the registry path for Windows API
	fullPath := `\Registry\Machine\` + strings.ReplaceAll(keyPath, `\`, `\\`)

	// Open the registry key with full access
	hKey, err := windows.OpenKey(windows.HKEY_LOCAL_MACHINE, fullPath, windows.KEY_ALL_ACCESS)
	if err != nil {
		return fmt.Errorf("failed to open registry key: %v", err)
	}
	defer windows.CloseKey(hKey)

	// Grant full access to administrators group
	sid, err := windows.CreateWellKnownSid(windows.WinBuiltinAdministratorsSid)
	if err != nil {
		return fmt.Errorf("failed to create administrators SID: %v", err)
	}

	acl, err := windows.NewExplicitAccessForSid(sid, windows.KEY_ALL_ACCESS, windows.CONTAINER_INHERIT_ACE|windows.OBJECT_INHERIT_ACE)
	if err != nil {
		return fmt.Errorf("failed to create ACL: %v", err)
	}

	err = windows.SetEntriesInAcl([]windows.EXPLICIT_ACCESS{*acl}, nil, &hKey)
	if err != nil {
		return fmt.Errorf("failed to set ACL: %v", err)
	}

	return nil
}

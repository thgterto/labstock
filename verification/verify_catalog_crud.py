from playwright.sync_api import sync_playwright, expect
import time

def verify_catalog_crud():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Login
            print("Navigating to login...")
            page.goto("http://localhost:3000/login")
            page.fill("input[type='text']", "admin")
            page.fill("input[type='password']", "admin")
            page.click("button[type='submit']")

            # Wait for dashboard or redirect
            page.wait_for_url("**/")
            print("Logged in successfully.")

            # 2. Navigate to Inventory
            print("Navigating to Inventory...")
            page.click("a[href='#/inventory']") # Assuming hash router
            expect(page.get_by_text("Catálogo de Inventário")).to_be_visible()

            # 3. Add Item
            print("Adding item...")
            page.click("text=Adicionar Item")
            page.fill("input[placeholder='ex: Acetona']", "Test Item CRUD")
            page.select_option("select", "CHEMICAL")
            page.fill("textarea", "Test Description")
            page.click("button:has-text('Salvar Item')")

            # 4. Verify Add
            print("Verifying add...")
            expect(page.get_by_text("Test Item CRUD")).to_be_visible()

            # 5. Edit Item
            print("Editing item...")
            # Click the edit button for the new item
            # The row contains "Test Item CRUD". We need to find the edit button in that row.
            row = page.get_by_role("row").filter(has_text="Test Item CRUD")
            row.get_by_title("Editar").click()

            expect(page.get_by_text("Editar Item")).to_be_visible()
            page.fill("input[value='Test Item CRUD']", "Updated Item CRUD")
            page.click("button:has-text('Salvar Alterações')")

            # 6. Verify Edit
            print("Verifying edit...")
            expect(page.get_by_text("Updated Item CRUD")).to_be_visible()
            expect(page.get_by_text("Test Item CRUD")).not_to_be_visible()

            # 7. Delete Item
            print("Deleting item...")
            row = page.get_by_role("row").filter(has_text="Updated Item CRUD")

            # Handle confirm dialog
            page.on("dialog", lambda dialog: dialog.accept())

            row.get_by_title("Excluir").click()

            # 8. Verify Delete
            print("Verifying delete...")
            # Wait a bit for reload/render
            time.sleep(1)
            expect(page.get_by_text("Updated Item CRUD")).not_to_be_visible()

            print("CRUD verification successful.")

            # Take screenshot of final state (should not show the item)
            page.screenshot(path="verification_crud.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification_failure.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_catalog_crud()

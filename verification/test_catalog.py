import time
from playwright.sync_api import sync_playwright

def test_catalog_crud():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login
        print("Navigating to App...")
        page.goto("http://localhost:3000/")

        # Wait for login or dashboard
        try:
            page.wait_for_selector("text=Bem-vindo de volta", timeout=5000)
            print("Logging in...")
            page.fill("input[type='text']", "admin")
            page.fill("input[type='password']", "admin")
            page.click("button[type='submit']")
            page.wait_for_selector("text=Painel", timeout=10000)
        except:
            print("Already logged in or dashboard loaded directly")

        # 2. Navigate to Inventory
        print("Navigating to Inventory...")
        page.goto("http://localhost:3000/#/inventory")

        # Wait for page to load
        page.wait_for_selector("text=Catálogo de Inventário", timeout=10000)

        # 3. Add Item
        print("Adding Item...")
        page.click("text=Adicionar Item")
        page.wait_for_selector("text=Adicionar Novo Item")

        test_item_name = "Test Chemical 123"
        page.fill("input[placeholder='ex: Acetona']", test_item_name)

        # Select category (it's the first select)
        page.select_option("select", "CHEMICAL")

        # Fill Min Stock (input type number)
        page.locator("input[type=number]").fill("10")

        page.click("text=Salvar Item")

        # 4. Verify Add
        page.wait_for_selector(f"text={test_item_name}")
        print("Add verified")

        # 5. Edit Item
        print("Editing Item...")
        row = page.locator(f"tr:has-text('{test_item_name}')")
        row.locator("button[title='Editar']").click()

        page.wait_for_selector("text=Editar Item")

        updated_name = "Test Chemical Updated"
        page.fill("input[placeholder='ex: Acetona']", updated_name)
        page.click("text=Salvar Alterações")

        # 6. Verify Edit
        page.wait_for_selector(f"text={updated_name}")
        print("Edit verified")

        # 7. View Details
        print("Viewing Details...")
        row = page.locator(f"tr:has-text('{updated_name}')")
        row.locator("button[title='Ver Detalhes']").click()

        page.wait_for_selector("text=Detalhes do Item")

        # Check if name input is disabled
        is_disabled = page.is_disabled("input[placeholder='ex: Acetona']")
        if not is_disabled:
            print("Error: Name input should be disabled in View mode")
            exit(1)
        print("View verified")

        page.click("text=Fechar")

        # 8. Delete Item
        print("Deleting Item...")
        # Handle dialog
        page.on("dialog", lambda dialog: dialog.accept())

        row = page.locator(f"tr:has-text('{updated_name}')")
        row.locator("button[title='Excluir']").click()

        # Wait for item to disappear
        page.wait_for_selector(f"text={updated_name}", state="hidden")
        print("Delete verified")

        browser.close()

if __name__ == "__main__":
    try:
        test_catalog_crud()
        print("All tests passed!")
    except Exception as e:
        print(f"Test failed: {e}")
        exit(1)

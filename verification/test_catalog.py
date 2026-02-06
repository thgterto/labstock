import time
from playwright.sync_api import sync_playwright

def test_catalog_crud():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        print("Navigating to root...")
        page.goto("http://localhost:3000/")

        # Wait for either login or dashboard
        try:
            print("Waiting for login or dashboard...")
            # Wait for h1 to appear
            page.wait_for_selector("h1", timeout=10000)

            # Check text
            if page.is_visible("text=Bem-vindo de volta"):
                print("Login page detected.")
                page.fill("input[name='username']", "admin")
                page.fill("input[name='password']", "admin")
                page.click("button[type='submit']")
                page.wait_for_selector("text=Painel", timeout=10000)
                print("Logged in.")
            elif page.is_visible("text=Painel"):
                print("Dashboard detected.")
            else:
                print("Unknown page content.")
                print(page.content())
        except Exception as e:
            print(f"Initial load failed: {e}")
            page.screenshot(path="verification/error_load.png")
            print("Screenshot saved to verification/error_load.png")
            exit(1)

        print("Navigating to Inventory...")
        page.goto("http://localhost:3000/#/inventory")

        try:
            page.wait_for_selector("text=Catálogo de Inventário", timeout=10000)
            print("Inventory loaded.")
        except:
             print("Inventory load failed.")
             page.screenshot(path="verification/error_inventory.png")
             print("Screenshot saved to verification/error_inventory.png")
             exit(1)

        # 3. Add Item
        print("Adding Item...")
        page.click("text=Adicionar Item")
        page.wait_for_selector("text=Adicionar Novo Item")

        test_item_name = "Test Chemical 123"
        page.get_by_label("Nome do Item").fill(test_item_name)

        # Select category
        page.get_by_label("Categoria").click()
        page.get_by_role("option", name="Químico").click()

        page.get_by_label("Estoque Mínimo").fill("10")

        page.get_by_role("button", name="Salvar Item").click()

        page.wait_for_selector(f"text={test_item_name}")
        print("Add verified")

        # 5. Edit Item
        print("Editing Item...")
        row = page.locator(f"tr:has-text('{test_item_name}')")
        # Assuming we can find the edit button by aria-label from Tooltip
        # If not, try by index: row.get_by_role("button").nth(1).click() (0 is view, 1 is edit, 2 is delete)
        row.get_by_role("button").nth(1).click()

        page.wait_for_selector("text=Editar Item")

        updated_name = "Test Chemical Updated"
        page.get_by_label("Nome do Item").fill(updated_name)
        page.get_by_role("button", name="Salvar Alterações").click()

        page.wait_for_selector(f"text={updated_name}")
        print("Edit verified")

        # 7. View Details
        print("Viewing Details...")
        row = page.locator(f"tr:has-text('{updated_name}')")
        row.get_by_role("button").nth(0).click() # View is first button

        page.wait_for_selector("text=Detalhes do Item")

        if not page.get_by_label("Nome do Item").is_disabled():
            print("Error: Name input should be disabled in View mode")
            exit(1)
        print("View verified")

        page.get_by_role("button", name="Fechar").click()

        # 8. Delete Item
        print("Deleting Item...")
        page.on("dialog", lambda dialog: dialog.accept())

        row = page.locator(f"tr:has-text('{updated_name}')")
        row.get_by_role("button").nth(2).click() # Delete is third button

        page.wait_for_selector(f"text={updated_name}", state="hidden")
        print("Delete verified")

        browser.close()

if __name__ == "__main__":
    test_catalog_crud()

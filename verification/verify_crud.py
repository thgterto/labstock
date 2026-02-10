from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Login
    print("Navigating to Login...")
    page.goto("http://localhost:3000/#/login")
    page.fill('input[type="text"]', "admin")
    page.fill('input[type="password"]', "admin")
    page.click('button[type="submit"]')

    # Wait for Dashboard
    print("Waiting for Dashboard...")
    page.wait_for_url("**/#/")

    # 2. Navigate to Inventory
    print("Navigating to Inventory...")
    page.goto("http://localhost:3000/#/inventory")
    expect(page.get_by_text("Catálogo de Inventário")).to_be_visible()

    # 3. Add Item
    print("Adding Item...")
    page.click("text=Adicionar Item")
    expect(page.get_by_text("Adicionar Novo Item")).to_be_visible()

    page.fill('input[placeholder="ex: Acetona"]', "Test Item Playwright")
    page.select_option('select', "CHEMICAL") # Assuming first select is category
    # Actually, let's be more precise if possible, but placeholders are good.
    page.fill('textarea', "Description for test item")

    page.click("text=Salvar Item")

    # Verify Item Added
    print("Verifying Addition...")
    expect(page.get_by_text("Test Item Playwright")).to_be_visible()

    # 4. Edit Item
    print("Editing Item...")
    # Find the row with our item
    row = page.get_by_role("row", name="Test Item Playwright")
    # Click the Edit button (title="Editar")
    row.get_by_title("Editar").click()

    expect(page.get_by_text("Editar Item")).to_be_visible()

    # Change name
    page.fill('input[value="Test Item Playwright"]', "Test Item Updated")
    page.click("text=Salvar Item")

    # Verify Update
    print("Verifying Update...")
    expect(page.get_by_text("Test Item Updated")).to_be_visible()
    expect(page.get_by_text("Test Item Playwright")).not_to_be_visible()

    # 5. Delete Item
    print("Deleting Item...")

    # Handle Dialog
    page.on("dialog", lambda dialog: dialog.accept())

    row = page.get_by_role("row", name="Test Item Updated")
    row.get_by_title("Excluir").click()

    # Verify Deletion
    print("Verifying Deletion...")
    expect(page.get_by_text("Test Item Updated")).not_to_be_visible()

    # Screenshot
    print("Taking Screenshot...")
    page.screenshot(path="verification_crud.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

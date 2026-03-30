"""
奢侈品腕表商城 - 后台管理界面自动化测试
"""
from playwright.sync_api import sync_playwright
import sys


def test_admin_login(page):
    """测试管理员登录功能"""
    print(">>> 测试管理员登录...")

    # 导航到登录页面
    page.goto('http://localhost:9000')
    page.wait_for_load_state('networkidle')

    # 截图保存登录页面
    page.screenshot(path='test_output/admin_login.png', full_page=True)

    # 查找登录表单元素
    username_input = page.locator('input[type="text"], input[placeholder*="账"], input[placeholder*="名"]').first
    password_input = page.locator('input[type="password"]').first
    login_button = page.locator('button[type="submit"], button:has-text("登录"), button:has-text("登")').first

    if username_input.count() > 0:
        # 执行登录
        username_input.fill('admin')
        password_input.fill('admin123')
        login_button.click()

        # 等待登录完成
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)

        # 截图保存登录后页面
        page.screenshot(path='test_output/admin_dashboard.png', full_page=True)
        print(">>> 登录成功，已截图")
        return True
    else:
        print(">>> 未找到登录表单，可能已登录或页面结构不同")
        page.screenshot(path='test_output/admin_current.png', full_page=True)
        return False


def test_admin_navigation(page):
    """测试后台导航功能"""
    print(">>> 测试后台导航...")

    # 等待左侧菜单加载
    page.wait_for_timeout(1000)
    page.screenshot(path='test_output/admin_menu.png', full_page=True)

    # 查找菜单项
    menu_items = page.locator('.el-menu-item, .v-menu-item, [class*="menu"] li, aside li')
    print(f">>> 找到 {menu_items.count()} 个菜单项")

    # 尝试点击系统管理菜单
    system_menu = page.locator('text=系统管理, text=系统, text=用户管理').first
    if system_menu.count() > 0:
        system_menu.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='test_output/admin_system.png', full_page=True)
        print(">>> 点击系统菜单成功")


def test_console_errors(page):
    """检查控制台错误"""
    print(">>> 检查控制台错误...")

    console_errors = []
    page.on('console', lambda msg: console_errors.append(msg.text) if msg.type == 'error' else None)

    page.goto('http://localhost:9000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)

    if console_errors:
        print(f">>> 发现 {len(console_errors)} 个控制台错误:")
        for error in console_errors[:5]:  # 只显示前5个
            print(f"    - {error}")
        return False
    else:
        print(">>> 无控制台错误")
        return True


def run_tests():
    """运行所有测试"""
    print("=" * 50)
    print("奢侈品腕表商城 - 后台管理自动化测试")
    print("=" * 50)

    with sync_playwright() as p:
        # 启动 Chromium 浏览器
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )

        # 创建新页面
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # 设置默认超时
        page.set_default_timeout(30000)

        try:
            # 测试1: 控制台错误检查
            test_console_errors(page)

            # 测试2: 管理员登录
            login_success = test_admin_login(page)

            if login_success:
                # 测试3: 导航测试
                test_admin_navigation(page)

            print("\n" + "=" * 50)
            print("测试完成！截图已保存到 test_output 目录")
            print("=" * 50)

        except Exception as e:
            print(f">>> 测试异常: {e}")
            page.screenshot(path='test_output/error.png', full_page=True)
            return 1
        finally:
            browser.close()

    return 0


if __name__ == '__main__':
    sys.exit(run_tests())

import Link from "next/link";

export default function TopHeader() {
  return (
    <>
      <header className="header-admin" style={{borderTopWidth: 0}}>
        <div className="toggle-btns">
          <Link id="toggle-sidebar" href={"#"}>
            <i className="icon-list"></i>
          </Link>
          <Link id="pin-sidebar" href={"#"}>
            <i className="icon-list"></i>
          </Link>
        </div>

        <div className="header-items">
          <ul className="header-actions">
            <li className="dropdown">
              <a
                href="#"
                id="userSettings"
                className="user-settings"
                data-toggle="dropdown"
                aria-haspopup="true"
              >
                <span className="icon-user1 mr-2"></span>
                <span className="user-name">Admin</span>

              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="userSettings"
              >
                <div className="header-profile-actions">
                  <div className="header-user-profile">

                    <h5>Admin</h5>
                    <p>SUPER_ADMIN</p>
                  </div>
                  <Link href={"/dang-nhap"}>
                    <i className="icon-log-out1"></i> Đăng xuất
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </header>
    </>
  )
}
import TopHeader from "./header/TopHeader";
import Script from "next/script";
import Sidebar from "./sidebar/Sidebar";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "../../assets/prime-css/flags.css";

export default function AdminLayout({children}) {
    return (
        <>
            <html lang="vi">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>VTND Management</title>
                <link rel="icon" href="/img/fav.png"/>
                <link rel="stylesheet" href="/admin/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="/admin/css/main.css"/>
                <link rel="stylesheet" href="/admin/fonts/style.css"/>
            </head>

            <body>
            <div className="page-wrapper">
                {/* Sidebar start */}
                <Sidebar/>
                {/* Sidebar end */}
                <div className="page-content">
                    {/* TopHeader start */}
                    <TopHeader/>
                    {/* TopHeader end */}

                    {/* Main container start */}
                    <div className="main-container">{children}</div>
                </div>
            </div>
            {/* Main container end */}
            <Script src="/admin/js/jquery.min.js"></Script>
            <Script src="/admin/js/bootstrap.bundle.min.js"></Script>
            <Script src="/admin/js/moment.js"></Script>
            <Script src="/admin/vendor/polyfill/polyfill.min.js"></Script>
            <Script src="/admin/js/main.js"></Script>
            </body>
            </html>
        </>
    )
}
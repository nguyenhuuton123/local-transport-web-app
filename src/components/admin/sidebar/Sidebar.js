import Link from "next/link";
import Image from 'next/image';
import {PanelMenu} from 'primereact/panelmenu';


export default function Sidebar() {
    let items = [
        {
            label: 'Quản lý bài viết',
            items: [
                {
                    label: 'Danh sách bài viết',
                    url: '/van-tai-noi-dia/admin/danh-sach-bai-viet'
                },

                {
                    label: 'Thêm bài viết mới',
                    url: '/van-tai-noi-dia/admin/them-bai-viet'
                }
            ]
        },

        {
            label: 'Quản lý ảnh',
            items: [
                {
                    label: 'Danh sách hình ảnh',
                    url: '/van-tai-noi-dia/admin/danh-sach-hinh-anh'
                },
                {
                    label: 'Thêm hình ảnh',
                    url: '/van-tai-noi-dia/admin/them-hinh-anh'

                },
            ]
        },

        {
            label: 'Quản lý tài khoản',
            items: [
                {
                    label: 'Danh sách tài khoản',
                    url: '/van-tai-noi-dia/admin/danh-sach-tai-khoan'
                },
                {
                    label: 'Thêm tài khoản',
                    url: '/van-tai-noi-dia/admin/them-tai-khoan'
                },
            ]
        },

        {
            label: 'Quản lý bảng giá',
            items: [
                {
                    label: 'Danh sách bảng giá',
                    url: '/van-tai-noi-dia/admin/danh-sach-bang-gia'
                },

                {
                    label: 'Thêm bảng giá',
                    url: '/van-tai-noi-dia/admin/them-bang-gia'
                }

            ]
        },

        {
            label: 'Quản lý chi nhánh',
            url: '/van-tai-noi-dia/admin/quan-ly-chi-nhanh'
        },

        {
            label: 'Quản lý danh mục',
            url: '/van-tai-noi-dia/admin/categories/quan-ly-danh-muc'
        },

        {
            label: 'Quản lý liên hệ',
            url: '/van-tai-noi-dia/admin/quan-ly-lien-he'
        },

        {
            label: 'Trang giới thiệu',
            url: '/van-tai-noi-dia/admin/gioi-thieu'
        },

        {
            label: 'Trang liên hệ',
            url: '/van-tai-noi-dia/admin/lien-he'
        },
    ]

    return (
        <>
            {/*<SidebarScripts/>*/}
            <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-brand">
                    <Link href={"/van-tai-noi-dia/admin"}>
                        <Image src="/img/logo-ngang-trang.png" alt="Web Admin Dashboard" width={230} height={80}/>
                    </Link>
                </div>
                <div
                    className="sidebar-content"
                    style={{overflow: "scroll", scrollbarWidth: "none"}}
                >
                    {/*-- Sidebar menu start -- */}
                    <div className="sidebar-menu">
                        <PanelMenu model={items} className="w-full md:w-20rem"/>
                    </div>
                    {/*-- Sidebar menu end -- */}
                </div>
            </nav>
        </>
    )
        ;
}


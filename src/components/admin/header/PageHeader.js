import Link from "next/link";

export default function PageHeader({title}) {
    return (
        <div className="page-header">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link href={"/van-tai-noi-dia/admin"}>Trang chủ</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
            </ol>
        </div>
    )
}
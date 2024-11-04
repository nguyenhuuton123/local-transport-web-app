"use client"
import PageHeader from "@/components/admin/header/PageHeader";
import React, {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {Badge} from "primereact/badge";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {ProgressSpinner} from "primereact/progressspinner";
import {DataTable} from "primereact/datatable";
import {Toolbar} from "primereact/toolbar";
import {Column} from "primereact/column";
import {useRouter} from "next/navigation";
import {dateFormat} from "@/utility/formatDateTime.utility";
import {Dialog} from "primereact/dialog";
import {Paginator} from "primereact/paginator";
import {Dropdown} from "primereact/dropdown";
import {listPost} from "@/mock-data/data";


export default function AdminPage() {
    const router = useRouter();
    let emptyPost = {
        id: "",
        name: "",
        topicName: "",
        createdAt: "",
        isHidden: "",
    };
    const status = [
        {name: "Đã đăng", code: false},
        {name: "Tạm ẩn", code: true},
    ];
    const [render, setRender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [posts, setPosts] = useState(listPost);
    const [postDialog, setPostDialog] = useState(false);
    const [deletePostDialog, setDeletePostDialog] = useState(false);
    const [deletePostsDialog, setDeletePostsDialog] = useState(false);
    const [post, setPost] = useState(emptyPost);
    const [selectedPosts, setSelectedPosts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [searchingKeyword, setSearchingKeyword] = useState("");
    const [keywordTemp, setKeywordTemp] = useState("");
    const toast = useRef(null);
    const dt = useRef(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchingKeyword(keywordTemp);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [keywordTemp]);

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setPostDialog(false);
    };

    const hideDeletePostDialog = () => {
        setDeletePostDialog(false);
    };

    const hideDeletePostsDialog = () => {
        setDeletePostsDialog(false);
    };

    const savePost = () => {
        setSubmitted(true);
        setRender(true);
        setPostDialog(false);
    };

    const editPost = (post) => {
        setPost({...post});
        setSelectedStatus(post.isHidden);
        setPostDialog(true);
    };
    const openDetail = (post) => {
        window.open(post.urlName, "_blank");
    }
    const confirmDeletePost = (post) => {
        setPost(post);
        setDeletePostDialog(true);
    };

    const deletePost = () => {

    };


    const confirmDeleteSelected = () => {
        setDeletePostsDialog(true);
    };

    const deleteSelectedPosts = () => {
        const articleList = selectedPosts.map((post) => post.id);
    };

    const leftToolbarTemplate = () => {
        return (

            <>
                <div className="my-2">
                    <Button
                        label="Thêm bài viết"
                        icon="pi pi-plus"
                        severity="success"
                        className="mr-2 rounded-4"
                        onClick={() => router.push("/van-tai-noi-dia/admin/them-bai-viet")}
                    />
                    <Button
                        label="Xóa"
                        icon="pi pi-trash"
                        severity="danger"
                        className="rounded-4"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedPosts || !selectedPosts.length}
                    />
                </div>
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <span>Tổng số lượng bài viết: <strong>{posts.totalElements}</strong> bài</span>
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Topic</span>
                {rowData.topicName}
            </>
        );
    };

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">CreatedAt</span>
                {dateFormat(rowData.createdAt)}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span>
                    {rowData.isHidden ? (
                        <Badge value="Tạm ẩn" severity="warning"></Badge>
                    ) : (
                        <Badge value="Đã đăng" severity="success"></Badge>
                    )}
                </span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-eye"
                    className="rounded-circle btn-info custom-btn mr-2"
                    onClick={() => {
                        openDetail(rowData)
                    }}
                />
                <>
                    <Button
                        icon="pi pi-pencil"
                        className="rounded-circle btn-success custom-btn mr-2"
                        onClick={() => editPost(rowData)}
                    />

                    <Button
                        icon="pi pi-trash"
                        className="rounded-circle btn-danger custom-btn"
                        onClick={() => confirmDeletePost(rowData)}
                    />
                </>
            </>
        );
    };

    const header = (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <h5 className="m-0">Quản lý bài viết</h5>
            <span className="mt-2 mt-md-0 p-input-icon-left border-solid border-2 border-neutral-950">
                <InputText
                    type="search"
                    onInput={(e) => setKeywordTemp(e.currentTarget.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    const postDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" text onClick={savePost}/>
        </>
    );
    const deletePostDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                text
                onClick={hideDeletePostDialog}
            />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePost}/>
        </>
    );
    const deletePostsDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                text
                onClick={hideDeletePostsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                text
                onClick={deleteSelectedPosts}
            />
        </>
    );

    return (
        <>
            <PageHeader title={"Danh sách bài viết"}/>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast}/>
                        <Toolbar
                            style={{margin: 20}}
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>

                        <DataTable
                            ref={dt}
                            value={posts.content}
                            selection={selectedPosts}
                            onSelectionChange={(e) => setSelectedPosts(e.value)}
                            dataKey="id"
                            className="datatable-responsive"
                            globalFilter={globalFilter}
                            emptyMessage={isLoading ? <ProgressSpinner/> : "No articles found."}
                            loading={isLoading}
                            loadingIcon={<ProgressSpinner/>}
                            header={header}
                            responsiveLayout="scroll"
                            style={{margin: "0 20px 20px"}}
                            tableStyle={{minHeight: "8rem"}}
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{width: "3rem"}}
                            ></Column>
                            <Column
                                field="name"
                                header="Tiêu đề"
                                sortable
                                body={nameBodyTemplate}
                                headerStyle={{minWidth: "23rem"}}
                            ></Column>
                            <Column
                                field="topic"
                                header="Chuyên mục"
                                sortable
                                body={categoryBodyTemplate}
                                headerStyle={{minWidth: "15rem"}}
                            ></Column>
                            <Column
                                field="createdAt"
                                header="Thời gian"
                                align="center"
                                body={timeBodyTemplate}
                                sortable
                                headerStyle={{minWidth: "15rem"}}
                            ></Column>
                            <Column
                                field="isHidden"
                                header="Trạng thái"
                                body={statusBodyTemplate}
                                sortable
                                headerStyle={{minWidth: "8rem"}}
                            ></Column>
                            <Column
                                body={actionBodyTemplate}
                                headerStyle={{minWidth: "11rem"}}
                            ></Column>
                        </DataTable>
                        <Paginator first={first} rows={rows} totalRecords={posts.totalElements}
                                   rowsPerPageOptions={[10, 20, 30]} onPageChange={onPage}/>
                        <Dialog
                            visible={postDialog}
                            style={{width: "450px"}}
                            header={post.name}
                            modal
                            className="p-fluid"
                            footer={postDialogFooter}
                            onHide={hideDialog}
                        >
                            <div className="field">
                                <label htmlFor="status">Trạng thái bài viết</label>
                                <Dropdown
                                    id="status"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.value)}
                                    options={status}
                                    optionLabel="name"
                                    optionValue="code"
                                    defaultValue={post.isHidden}
                                    className="w-full"
                                />
                            </div>
                            <div className="mt-5">
                                <Button
                                    icon="pi pi-pencil"
                                    className="btn btn-danger"
                                    label="Chỉnh sửa chi tiết bài viết"
                                    severity="success"
                                    text
                                    onClick={() => router.push(`/van-tai-noi-dia/admin/cap-nhat-bai-viet/${post.id}`)}
                                />
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deletePostDialog}
                            style={{width: "450px"}}
                            header="Xác nhận"
                            modal
                            footer={deletePostDialogFooter}
                            onHide={hideDeletePostDialog}
                        >
                            <div className="flex align-items-center justify-content-center">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{fontSize: "2rem"}}
                                />
                                {post && (
                                    <span>
                                        Bạn có chắc chắn muốn xóa bài viết <b>{post.name}</b>?
                                        <br/>
                                        <small style={{color: "red"}}>
                                            Lưu ý: Hành động này sẽ không thể khôi phục.
                                        </small>
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deletePostsDialog}
                            style={{width: "450px"}}
                            header="Xác nhận"
                            modal
                            footer={deletePostsDialogFooter}
                            onHide={hideDeletePostsDialog}
                        >
                            <div className="flex align-items-center justify-content-center">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{fontSize: "2rem"}}
                                />
                                {post && (
                                    <span>
                                        Bạn có chắc chắn muốn xóa các bài viết đã chọn?
                                        <br/>
                                        <small style={{color: "red"}}>
                                            Lưu ý: Hành động này sẽ không thể khôi phục.
                                        </small>
                                    </span>
                                )}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    );
}
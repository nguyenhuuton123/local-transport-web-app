"use client";
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { getAllCategories, deleteCategory, createCategory, updateCategory, deleteCategories } from '../../../../../api/CategoryAPIcalls';
import './SearchComponent.css';
import Link from 'next/link';

const Categories = () => {
    let emptyCategory = {
        name: '',
        description: '',
        parentCategory: '',
        url_name: '',
        status: 'ACTIVE'
    };

    const [categories, setCategories] = useState([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [validation, setValidation] = useState({
        name: true,
        url_name: true
    });
    const [duplicateError, setDuplicateError] = useState({
        name: false,
        url_name: false
    });

    const [localCategory, setLocalCategory] = useState(category);
    const nameInputRef = useRef(null);

    useEffect(() => {
        setLocalCategory(category);
    }, [category]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const newUrlName = slugify(localCategory.name);
            setLocalCategory(prevState => ({ ...prevState, url_name: newUrlName }));
            onInputChange({ target: { value: newUrlName } }, 'url_name');
        }, 500); // Adjust the delay as needed

        return () => {
            clearTimeout(handler);
        };
    }, [localCategory.name]);

    const slugify = (text) => {
        return '/' + text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            .normalize('NFD') // Normalize the string (decompose combined characters)
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars except for "-"
            .replace(/\-\-+/g, '-'); // Replace multiple - with single -
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setLocalCategory({ ...localCategory, name: newName });
        onInputChange({ ...e, target: { ...e.target, value: newName } }, 'name');
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data.data);
    };

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    useEffect(() => {
        if (categoryDialog) {
            validateFields();
        }
    }, [categoryDialog]);

    const validateFields = () => {
        const isNameValid = category.name.trim() !== '';
        const isUrlNameValid = category.url_name.trim() !== '' && /^\/.*$/.test(category.url_name);
        setValidation({
            name: isNameValid,
            url_name: isUrlNameValid
        });
        return isNameValid && isUrlNameValid;
    };

    const checkDuplicate = () => {
        const isNameDuplicate = categories.some(t => t.name === category.name && t.id !== category.id);
        const isUrlNameDuplicate = categories.some(t => t.url_name === category.url_name && t.id !== category.id);

        setDuplicateError({
            name: isNameDuplicate,
            url_name: isUrlNameDuplicate
        });
        return !isNameDuplicate && !isUrlNameDuplicate;
    };

    const saveCategory = async () => {
        setSubmitted(true);
        if (validateFields() && checkDuplicate()) {
            const isNameDuplicate = categories.some(t => t.name === category.name && t.id !== category.id);
            const isUrlNameDuplicate = categories.some(t => t.url_name === category.url_name && t.id !== category.id);
            if (isNameDuplicate || isUrlNameDuplicate) {
                setDuplicateError({
                    name: isNameDuplicate,
                    url_name: isUrlNameDuplicate
                });
                return;
            }
            let _categories = [...categories];
            let _category = { ...category };
            if (category.id) {
                await updateCategory(category.id, _category);
                const index = findIndexById(category.id);
                _categories[index] = _category;
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã sửa danh mục', life: 3000 });
            } else {
                await createCategory(_category);
                _categories.push(_category);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo danh mục', life: 3000 });
            }
            setCategories(_categories);
            setCategoryDialog(false);
            setCategory(emptyCategory);
            fetchCategories();
        }
    };

    const editCategory = (category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };

    const deleteCategoryById = async () => {
        await deleteCategory(category.id);
        fetchCategories();
        setDeleteCategoryDialog(false);
        setCategory(emptyCategory);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xoá danh mục', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };

    const deleteSelectedCategories = async () => {
        await deleteCategories(selectedCategories);
        fetchCategories();
        setDeleteCategoriesDialog(false);
        setSelectedCategories(null);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xoá danh mục', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _category = { ...category };
        _category[`${name}`] = val;
        setCategory(_category);
        setDuplicateError({ ...duplicateError, [name]: false });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Thêm" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Xoá" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <>
                    <>
                        <Button
                            icon="pi pi-pencil"
                            className="rounded-circle btn-success custom-btn mr-2"
                            onClick={() => editCategory(rowData)}
                        />

                        <Button
                            icon="pi pi-trash"
                            className="rounded-circle btn-danger custom-btn"
                            onClick={() => confirmDeleteCategory(rowData)}
                        />
                    </>
                </>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Quản Lý Danh Mục</h4>
            <div className="search-container">
                <i className="pi pi-search search-icon" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="search-input"
                />
            </div>
        </div>
    );

    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Huỷ" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveCategory} />
        </React.Fragment>
    );

    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteCategoryDialog} />
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteCategoryById} />
        </React.Fragment>
    );

    const deleteCategoriesDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteCategoriesDialog} />
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategories} />
        </React.Fragment>
    );

    const categoryNameTemplate = (rowData) => {
        return (
            <Link title={"bấm vào đây để xem danh sách chủ đề tương ứng"} href={`/van-tai-noi-dia/admin/topics/danh-sach-topic/${rowData.id}`} style={{ textDecoration: 'none', color: '#0070f3' }}>
                {rowData.name}
            </Link>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <span title={rowData.name}>
                {rowData.name}
            </span>
        );
    };

    return (
        <div style={{ marginTop: 100 }}>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={categories} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
                    dataKey="id"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="name" header="Tên" body={categoryNameTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="url_name" header="Tên đường dẫn" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Danh mục" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Tên danh mục</label>
                    <InputText id="name"
                        value={localCategory.name}
                        onChange={handleNameChange}
                        required
                        autoFocus
                        ref={nameInputRef}
                        className={classNames({ 'p-invalid': submitted && (!validation.name || duplicateError.name) })} />
                    {submitted && !validation.name && <small className="p-error">Tên danh mục không được để trống.</small>}
                    {submitted && duplicateError.name && <small className="p-error">Tên danh mục phải là duy nhất.</small>}
                </div>
                <div className="field">
                    <label htmlFor="url_name">Tên đường dẫn</label>
                    <InputText id="url_name" value={category.url_name} onChange={(e) => onInputChange(e, 'url_name')} required className={classNames({ 'p-invalid': submitted && (!validation.url_name || duplicateError.url_name) })} />
                    {submitted && !validation.url_name && <small className="p-error">Tên đường dẫn không hợp lệ.</small>}
                    {submitted && duplicateError.url_name && <small className="p-error">Tên đường dẫn phải là duy nhất.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {category && <span>Bạn có chắc là muốn xoá <b>{category.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoriesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {category && <span>Bạn có chắc là muốn xoá các danh mục đã chọn?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default Categories;

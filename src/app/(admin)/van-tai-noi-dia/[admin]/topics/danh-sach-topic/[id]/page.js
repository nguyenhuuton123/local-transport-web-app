"use client";
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { getTopicsByCategoryId, createTopic, updateTopic, deleteTopic, deleteTopics } from '../../../../../../api/CategoryAPIcalls';
import './SearchComponent.css';
import { usePathname } from 'next/navigation';

const Topics = () => {
  const pathname = usePathname();
  const categoryId = pathname.split('/').pop();
  let emptyTopic = {
    name: '',
    description: '',
    categoryId: categoryId,
    url_name: '',
    status: 'ACTIVE'
  };

  const [topics, setTopics] = useState([]);
  const [topicDialog, setTopicDialog] = useState(false);
  const [deleteTopicDialog, setDeleteTopicDialog] = useState(false);
  const [deleteTopicsDialog, setDeleteTopicsDialog] = useState(false);
  const [topic, setTopic] = useState(emptyTopic);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  // const [validation, setValidation] = useState({
  //   name: true,
  //   url_name: true
  // });
  // const [duplicateError, setDuplicateError] = useState({
  //   name: false,
  //   url_name: false
  // });
  const [errorFromBackend, setErrorFromBackend] = useState({
    name: '',
    url_name: '',
    description: ''
  });

  const [localTopic, setLocalTopic] = useState(topic);
  const nameInputRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    setLocalTopic(topic);
  }, [topic]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newUrlName = slugify(localTopic.name);
      setLocalTopic(prevState => ({ ...prevState, url_name: newUrlName }));
      onInputChange({ target: { value: newUrlName } }, 'url_name');
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [localTopic.name]);

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
    setLocalTopic({ ...localTopic, name: newName });
    onInputChange({ ...e, target: { ...e.target, value: newName } }, 'name');
  };

  const handleDescriptionChange = (e) => {
    const start = e.target.selectionStart;
    const newDescription = e.target.value;
    setLocalTopic({ ...localTopic, description: newDescription });
    onInputChange({ ...e, target: { ...e.target, value: newDescription } }, 'description');
    setTimeout(() => {
      descriptionRef.current.setSelectionRange(start, start);
    }, 0);
  };

  useEffect(() => {
    if (categoryId) {
      fetchTopics();
    }
  }, [categoryId]);

  // useEffect(() => {
  //   if (categoryId) {
  //     fetchCategory();
  //   }
  // }, [categoryId]);

  const fetchTopics = async () => {
    const data = await getTopicsByCategoryId(categoryId);
    setTopics(data.data);
  };

  // const fetchCategory = async () => {
  //   const data = await getCategoryById(categoryId);
  //   setCategory(data.data);
  // };

  // useEffect(() => {
  //   if (topicDialog) {
  //     validateFields();
  //   }
  // }, [topicDialog]);

  // const validateFields = () => {
  //   const isNameValid = topic.name.trim() !== '' && category.name !== topic.name.trim();
  //   const isUrlNameValid = topic.url_name.trim() !== '' && /^\/.*$/.test(topic.url_name);
  //   setValidation({
  //     name: isNameValid,
  //     url_name: isUrlNameValid
  //   });

  //   return isNameValid && isUrlNameValid;
  // };

  const validateFields = () => {
    let valid = true;
    let errors = {};
    if (!topic.name) {
      errors.name = "Tên chủ đề không được để trống";
      valid = false;
    }
    if (!topic.url_name) {
      errors.url_name = "Tên đường dẫn không được để trống";
      valid = false;
    }
    if (!topic.url_name) {
      errors.description = "Mô tả không được để trống";
      valid = false;
    }
    setErrorFromBackend(errors);
    return valid;
  };

  const openNew = () => {
    setTopic(emptyTopic);
    setSubmitted(false);
    setTopicDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTopicDialog(false);
  };

  const hideDeleteTopicDialog = () => {
    setDeleteTopicDialog(false);
  };

  const hideDeleteTopicsDialog = () => {
    setDeleteTopicsDialog(false);
  };

  const saveTopic = async () => {
    setSubmitted(true);
    if (validateFields()) {
      let _topics = [...topics];
      let _topic = { ...topic };
      if (topic.id) {
        try {
          await updateTopic(topic.id, _topic);
          const index = findIndexById(topic.id);
          _topics[index] = _topic;
          toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã sửa chủ đề', life: 3000 });
          setTopicDialog(false);
          setTopic(emptyTopic);
          fetchTopics();
        } catch (error) {
          validation(error);
        }
      } else {
        try {
          await createTopic(_topic);
          _topics.push(_topic);
          toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã sửa chủ đề', life: 3000 });
          setTopics(_topics);
          setTopicDialog(false);
          setTopic(emptyTopic);
          fetchTopics();
        } catch (error) {
          validation(error);
        }
      }
    }
  };

  const validation = (error) => {
    if (error.response && error.response.data) {
      const message = error.response.data.message;
      const errors = error.response.data.data;
      console.log("Error message from backend:", message);
      if (message.includes("Duplicate topic name")) {
        setErrorFromBackend(prevState => ({ ...prevState, name: "Tên chủ đề phải là duy nhất." }));
      } else if (message.includes("Duplicate URL name")) {
        setErrorFromBackend(prevState => ({ ...prevState, url_name: "Tên đường dẫn phải là duy nhất." }));
      } else if (message.includes("Topic name cannot be the same as category name")) {
        setErrorFromBackend(prevState => ({ ...prevState, name: "Tên chủ đề không được trùng với tên danh mục." }));
      } else if (errors) {
        setErrorFromBackend(errors);
      } else {
        setErrorFromBackend(prevState => ({ ...prevState, name: message }));
      }
      console.log("Updated errorFromBackend:", errorFromBackend);
    } else {
      setErrorFromBackend(prevState => ({ ...prevState, name: 'Something went wrong' }));
      console.log("Updated errorFromBackend with fallback:", errorFromBackend);
    }
  }

  const editTopic = (topic) => {
    setTopic({ ...topic });
    setTopicDialog(true);
  };

  const confirmDeleteTopic = (topic) => {
    setTopic({ ...topic });
    setDeleteTopicDialog(true);
  };

  const deleteTopicById = async () => {
    console.log(topic.id)
    console.log(topic)
    await deleteTopic(topic.id);
    fetchTopics();
    setDeleteTopicDialog(false);
    setTopic(emptyTopic);
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xoá chủ đề', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteTopicsDialog(true);
  };

  const deleteSelectedTopics = async () => {
    await deleteTopics(selectedTopics);
    fetchTopics();
    setDeleteTopicsDialog(false);
    setSelectedTopics(null);
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xoá chủ đề', life: 3000 });
  };

  // const onInputChange = (e, name) => {
  //   const val = (e.target && e.target.value) || '';
  //   let _topic = { ...topic };
  //   _topic[`${name}`] = val;
  //   setTopic(_topic);
  //   // Reset duplicate error khi người dùng nhập lại
  //   setDuplicateError({ ...duplicateError, [name]: false });

  //   // Cập nhật trạng thái validation
  //   let _validation = { ...validation };
  //   if (name === 'name' || name === 'url_name') {
  //     _validation[name] = val.trim() !== '';
  //   }
  //   setValidation(_validation);
  // };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _topic = { ...topic };
    _topic[`${name}`] = val;
    // if (errorFromBackend[name]) {
    //   setErrorFromBackend(prevState => ({ ...prevState, [name]: '' }));
    // }
    setTopic(_topic);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Thêm" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Xoá" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTopics || !selectedTopics.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <>
          <>
            <Button
              icon="pi pi-pencil"
              className="rounded-circle btn-success custom-btn mr-2"
              onClick={() => editTopic(rowData)}
            />
            <Button
              icon="pi pi-trash"
              className="rounded-circle btn-danger custom-btn"
              onClick={() => confirmDeleteTopic(rowData)}
            />
          </>
        </>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Quản Lý Chủ Đề</h4>
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

  const topicDialogFooter = (
    <React.Fragment>
      <Button label="Huỷ" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Lưu" icon="pi pi-check" onClick={saveTopic} />
    </React.Fragment>
  );

  const deleteTopicDialogFooter = (
    <React.Fragment>
      <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteTopicDialog} />
      <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteTopicById} />
    </React.Fragment>
  );

  const deleteTopicsDialogFooter = (
    <React.Fragment>
      <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteTopicsDialog} />
      <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteSelectedTopics} />
    </React.Fragment>
  );

  return (
    <div style={{ marginTop: 100 }}>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={topics} selection={selectedTopics} onSelectionChange={(e) => setSelectedTopics(e.value)}
          dataKey="id"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} topics" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="name" header="Tên" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="url_name" header="Tên đường dẫn" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="description" header="Mô tả" sortable style={{ minWidth: '14rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={topicDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Chủ đề" modal className="p-fluid" footer={topicDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Tên chủ đề</label>
          <InputText
            id="name"
            value={localTopic.name}
            onChange={handleNameChange}
            required
            autoFocus
            ref={nameInputRef}
            className={classNames({ 'p-invalid': submitted && errorFromBackend.name })}
          />
          {errorFromBackend.name && <small className="p-error">{errorFromBackend.name}</small>}
        </div>
        <div className="field">
          <label htmlFor="description">Mô tả</label>
          <InputTextarea
            id="description"
            value={localTopic.description}
            onChange={handleDescriptionChange}
            required
            rows={3}
            cols={20}
            autoFocus
            ref={descriptionRef}
            className={classNames({ 'p-invalid': submitted && errorFromBackend.description })}
          />
          {errorFromBackend.description && <small className="p-error">{errorFromBackend.description}</small>}
        </div>
        <div className="field">
          <label htmlFor="url_name">Tên đường dẫn</label>
          <InputText id="url_name" value={localTopic.url_name} onChange={(e) => onInputChange(e, 'url_name')} required className={classNames({ 'p-invalid': submitted && errorFromBackend.url_name })} />
          {errorFromBackend.url_name && <small className="p-error">{errorFromBackend.url_name}</small>}
        </div>
      </Dialog>

      <Dialog visible={deleteTopicDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteTopicDialogFooter} onHide={hideDeleteTopicDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {topic && <span>Bạn có chắc là muốn xoá <b>{topic.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteTopicsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteTopicsDialogFooter} onHide={hideDeleteTopicsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {topic && <span>Bạn có chắc là muốn xoá các chủ đề đã chọn?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default Topics;

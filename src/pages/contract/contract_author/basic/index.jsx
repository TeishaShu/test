import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined, PaperClipOutlined, FileAddOutlined, AppstoreOutlined, ContainerTwoTone, ApartmentOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Input,
  Checkbox,
  Button,
  Pagination,
  Table,
  Select,
  Radio,
  Tooltip,
  Modal,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { confirm } = Modal;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;

export const contractAuthor = props => {
  const {
    loading,
    dispatch,
    contractAuthorList: { changeId, list },
  } = props;
  const [columnName, setColumnName] = useState('contract_code');
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const [remainingDays, setRemainingDays] = useState('0');
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [colOrder, setColOrder] = useState('contract_group_name');
  const [colSort, setColSort] = useState('asc');

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('contract_author_basic'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        remainingDays: (getSession.remaining_days === null) ? "0" : getSession.remaining_days,
      }
      delete session_ui['remaining_days'];
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        column: columnName,
        keyword: keyword,
        precise: precise,
        remainingDays: remainingDays,
        pageCurrent: pageCurrent,
        order: colOrder,
        sort: colSort,
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setColumnName(show_ui.column)
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setRemainingDays(show_ui.remainingDays)
      setPageCurrent(show_ui.pageCurrent);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      column: (show_ui && show_ui.column) ? show_ui.column : columnName,  // optional
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),  // optional
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),  // optional
      page_size: pageSize.toString(),  // optional
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      remaining_days: (show_ui && show_ui.remainingDays != undefined) ? ((show_ui.remainingDays == '0') ? null : show_ui.remainingDays) : ((remainingDays == '0') ? null : remainingDays),  // optional
      order: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('contract_author_basic', tempToString);

    dispatch({
      type: 'contractAuthorList/fetchGetList',
      payload: temp,
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // contractRenewal
  const contractRenewal = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchContractRenewal',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // deleteSubcontract
  const deleteSubcontract = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchDeleteSubcontract',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // addSubcontract
  const addSubcontract = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchAddSubcontract',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // confirm
  const showConfirm = (type, text, para) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要${text}嗎？`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        switch (type) {
          case 'contractRenewal':
            contractRenewal(para)
            break;
          case 'deleteSubcontract':
            deleteSubcontract(para);
            break;
          case 'addSubcontract':
            addSubcontract(para);
            break;
        }
      },
      onCancel() { },
    });
  }

  // ui -----
  // columnName
  const changeColumnName = (value) => {
    setColumnName(value);
  }

  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  // precise
  const changePrecise = (e) => {
    setPrecise(e.target.checked);
  }

  // clickQuery
  const clickQuery = () => {
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setColumnName('contract_code');
    setKeyword('');
    setPrecise(false);
    setPageCurrent(1);
    setRemainingDays('0');
    setColOrder('contract_group_name');
    setColSort('asc');
    getData({
      column: 'contract_code',
      keyword: '',
      precise: false,
      pageCurrent: 1,
      remainingDays: '0',
      order: 'contract_group_name',
      sort: 'asc'
    });
  }

  // remainingDays
  const changeRemainingDays = (e) => {
    setRemainingDays(e.target.value);
    setPageCurrent(1);
    getData({
      remainingDays: e.target.value,
      pageCurrent: 1,
    });
  }

  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({
      pageCurrent: nowPage
    });
  }

  // checkIsContractTermination
  const checkIsContractTermination = (data) => {
    if (!data) {
      return false;
    }

    // !永久 && (('合約提前終止' && ('合約提前終止' - 當天日期) < 0) || (!'合約提前終止' && '合約有效日' ('合約有效日' - 當天日期) < 0)) 則顯示 Alert 及隱藏相關按鈕
    if (data.is_permanent != '1' && ((data.contract_termination_date && (((new Date(data.contract_termination_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)) || (!data.contract_termination_date && !data.contract_expiry_date && (((new Date(data.contract_expiry_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)))) {
      return true;
    } else {
      return false;
    }
  }

  // isContractTerminationColor
  const isContractTerminationColor = { style: { backgroundColor: '#DBDBDB' } };

  // renderBgColor
  const renderBgColor = (groupName) => {
    const rowBgStyle = [
      { backgroundColor: '#FFF6BF' },
      { backgroundColor: '#FFE4BF' },
      { backgroundColor: '#E0FFBF' },
      { backgroundColor: '#BFFFE9' },
      { backgroundColor: '#BFF7FF' },
      { backgroundColor: '#BFCCFF' },
      { backgroundColor: '#DDBFFF' },
      { backgroundColor: '#FEBFFF' },
      { backgroundColor: '#FFBFD7' },
      { backgroundColor: '#FFCBBF' },
      { backgroundColor: '#FFFBE1' },  // #FFF6BF + L17
      { backgroundColor: '#FFF2E1' },  // #FFE4BF + L17
      { backgroundColor: '#F0FFE1' },  // #E0FFBF + L17
      { backgroundColor: '#E1FFF5' },  // #BFFFE9 + L17
      { backgroundColor: '#E1FBFF' },  // #BFF7FF + L17
      { backgroundColor: '#E1E7FF' },  // #BFCCFF + L17
      { backgroundColor: '#EFE1FF' },  // #DDBFFF + L17
      { backgroundColor: '#FFE1FF' },  // #FEBFFF + L17
      { backgroundColor: '#FFE1EC' },  // #FFBFD7 + L17
      { backgroundColor: '#FFE7E1' },  // #FFCBBF + L17
    ];
    let colorIdx;

    if (groupName) {
      colorIdx = list.ui_group_list.findIndex((elem) => elem == groupName);
    }

    return (colorIdx != undefined) ? { style: rowBgStyle[colorIdx] } : undefined;
  }

  // table columns
  const columns = [
    {
      title: '',
      dataIndex: 'contract_code',
      key: 'contract_code',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: '',
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '合約編號',
      dataIndex: 'contract_code',
      key: 'contract_code',
      width: '10%',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (row.contract_code) ? (<Link to={`/contract/contract_author/adv/${row.id}`}>{text}</Link>) : (row.subcontract_code),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      },
    },
    {
      title: '',
      dataIndex: 'contract_code',
      key: 'contract_code',
      width: '5%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (row.contract_code && row.contract_group_name) ? (<ApartmentOutlined className={styles.om_icon_style} />) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '簽約對象',
      dataIndex: 'party_b_object_company',
      key: 'party_b_object_company',
      width: '15%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (row.party_b_object_company)
            ? (row.party_b_object_company.name)
            : (
              (row.party_b_object_author)
                ? (row.party_b_object_author.name)
                : ('')
            ),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '',
      dataIndex: 'party_b_object_company',
      key: 'party_b_object_company',
      width: '5%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (row.party_b_object_company)
            ? ('')
            : (
              (row.party_b_object_author && row.contract_code)
                ? (
                  <Tooltip title="相關藝人合約">
                    <ContainerTwoTone
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (row.party_b_object_author.is_delete == '1') {
                          commFn.errHandler('此藝人已被刪除，無法跳轉');
                        } else {
                          history.push(`/information/author/adv/${row.party_b_object_author.id}/contract_author`);
                        }
                      }}
                    />
                  </Tooltip>
                )
                : ('')
            ),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '簽約單位',
      dataIndex: 'party_b_company',
      key: 'party_b_company',
      width: '15%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: text,
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '合約開始日',
      dataIndex: 'contract_start_date',
      key: 'contract_start_date',
      width: '10%',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: text,
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '合約到期日',
      dataIndex: 'contract_end_date',
      key: 'contract_end_date',
      width: '10%',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '合約有效日',
      dataIndex: 'contract_expiry_date',
      key: 'contract_expiry_date',
      width: '10%',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '續約年限',
      dataIndex: 'renewal_period',
      key: 'renewal_period',
      width: '10%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '',
      dataIndex: 'has_file',
      key: 'has_file',
      width: '5%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (text == '1' && row.contract_code)
            ? (<Tooltip title="附加檔案"><PaperClipOutlined className={styles.om_icon_style} /></Tooltip>)
            : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '',
      dataIndex: 'contract_expiry_date',
      key: 'contract_expiry_date',
      width: '5%',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);
        let renewContract = false;

        if (row.contract_expiry_date && row.renewal_period && (new Date(row.contract_expiry_date) - new Date()) / 1000 / 60 / 60 / 24 < 60) {
          renewContract = true;
        }

        return {
          children: (renewContract && !commFn.convertToBool(row.is_permanent))
            ? (
              <Tooltip title="續約">
                <FileAddOutlined
                  className={styles.om_icon_style}
                  style={{ color: '#1976D2' }}
                  onClick={() => {
                    showConfirm('contractRenewal', '續約', { contract_author_id: row.id, renewal_period: row.renewal_period });
                  }}
                />
              </Tooltip>
            )
            : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        let style = renderBgColor(row.contract_group_name);

        return {
          children: (!checkIsContractTermination(row) && row.contract_code)
            ? (
              (row.subcontracts && row.subcontracts.length > 0)
                ? (
                  <Tooltip title="刪除子合約">
                    <AppstoreOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        showConfirm('deleteSubcontract', '刪除子合約', { contract_author_id: row.id });
                      }}
                    />
                  </Tooltip>
                )
                : (
                  (row.party_b_object_author && row.party_b_object_author.id && row.party_b_object_author.type == '2')
                    ? (
                      <Tooltip title="分拆子合約">
                        <AppstoreOutlined
                          className={styles.om_icon_style}
                          style={{ color: '#54A767' }}
                          onClick={() => {
                            if (row.party_b_object_author.is_delete == '1') {
                              commFn.errHandler('此藝人已被刪除，無法分拆');
                            } else {
                              showConfirm('addSubcontract', '分拆子合約', { contract_author_id: row.id, contract_code: row.contract_code, parent_author_id: row.party_b_object_author.id });
                            }
                          }}
                        />
                      </Tooltip>
                    )
                    : ('')
                )
            )
            : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : style)
        };
      }
    },
  ];

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    let val_order = sorter.columnKey;
    let val_sort = (sorter.order != undefined) ? sorter.order : '';

    if (val_sort == '') {
      val_order = 'contract_group_name';
      val_sort = 'asc';
    }

    setColOrder(val_order);
    setColSort(val_sort);
    getData({ order: val_order, sort: val_sort });
  }

  // search
  const onFinish = () => {
    clickQuery();
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <Form
              name="search"
              onFinish={onFinish}
              style={{ display: 'inline' }}
            >
              <Select
                className={styles.om_list_radios}
                style={{ width: 150 }}
                value={columnName}
                onChange={changeColumnName}
              >
                <Option value="contract_code">合約編號</Option>
                <Option value="party_b_object_author">簽約對象(藝人)</Option>
                <Option value="party_b_object_company">簽約對象(公司)</Option>
                <Option value="party_b_company">簽約單位</Option>
              </Select>
              <Input
                className={styles.om_list_keyword}
                placeholder="請輸入"
                value={keyword}
                onChange={changeKeyword}
              />
              <Checkbox
                className={styles.om_list_precise}
                checked={precise}
                onChange={changePrecise}
              >
                精準查詢
              </Checkbox>
              <Button
                className={styles.om_sp_m_rb}
                type="primary"
                htmlType="submit"
              >
                查詢
              </Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={resetQuery}
              >
                重設
              </Button>
            </Form>
          </Col>
          <Col
            xs={24} md={8}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.om_sp_m_lb}
              href={`${REACT_APP_PUBLIC_PATH}/#/contract/contract_author/update`}
            >
              新增合約
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <RadioGroup
              className={styles.om_list_radios}
              value={remainingDays}
              onChange={changeRemainingDays}
            >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="90">90天內</RadioButton>
              <RadioButton value="60">60天內</RadioButton>
              <RadioButton value="30">30天內</RadioButton>
            </RadioGroup>
          </Col>
          <Col xs={24} md={12}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={list.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={list.total_items}
              pageSize={pageSize}
              changeId={changeId}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <Table
              className={styles.mainTable}
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
              onChange={changeColumn}
              expandable={{
                childrenColumnName: 'subcontracts',
                expandIconColumnIndex: 0,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.subcontracts && record.subcontracts.length > 0 ? (
                    expanded ? (
                      <MinusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={e => onExpand(record, e)}
                      />
                    ) : (
                      <PlusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={e => onExpand(record, e)}
                      />
                    )
                  ) : ''
              }}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loading: loading.models.contractAuthorList,
}))(contractAuthor);
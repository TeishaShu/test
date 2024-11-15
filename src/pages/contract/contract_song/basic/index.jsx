import globalSettings from '@/fn/globalsettings';
import {
  FileAddOutlined,
  PlusOutlined,
  PaperClipOutlined,
  ApartmentOutlined,
  ContainerTwoTone,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Radio,
  Checkbox,
  Button,
  Select,
  Pagination,
  Table,
  Tooltip,
  message,
  Modal,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import cusStyles from '@/pages/contract/contract_song/styles/index.less';

const { Option } = Select;
const { confirm } = Modal;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export const ContractSong = props => {
  const {
    loading,
    dispatch,
    contractSongList: { changeId, list },
  } = props;

  const [keyword, setKeyword] = useState(undefined);
  const [precise, setPrecise] = useState(false);
  const [role, setRole] = useState('0');
  const [type, setType] = useState('contract_code');
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [colOrder, setColOrder] = useState('contract_code');
  const [colSort, setColSort] = useState('asc');

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('contract_song_basic'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        role: getSession.expire_within,
      }
      delete session_ui['expire_within'];
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
        role: role,
        type: type,
        sort: colSort,
        order: colOrder
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setType(show_ui.type)
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setRole(show_ui.role);
      setPageCurrent(show_ui.pageCurrent);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      keyword: (show_ui && show_ui.keyword !== undefined) ? show_ui.keyword : keyword,
      type: (show_ui && show_ui.type !== undefined) ? show_ui.type : type,
      precise: (show_ui && show_ui.precise !== undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      expire_within: (show_ui && show_ui.role) ? show_ui.role : role,
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order_by: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('contract_song_basic', tempToString);

    // api
    dispatch({
      type: 'contractSongList/fetchGetList',
      payload: temp
    });
  };

  // renew contract api
  const renewContract = (renew_id) => {
    dispatch({
      type: 'contractSongList/renewContract',
      payload: {
        id: parseInt(renew_id, 10),
      },
      callback: res => {
        if (res && res.data === true) {
          getData();
          message.success('續約成功');
        }
      },
    });
  };

  // mount
  useEffect(() => {
    getData();
  }, []);

  // ui -----
  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  // precise
  const changePrecise = (e) => {
    setPrecise(e.target.checked);
  };

  // search
  const onFinish = () => {
    setPageCurrent(1);
    getData({
      keyword,
      precise,
      role,
      type,
      pageCurrent: 1,
    });
  };

  // resetQuery
  const resetQuery = () => {
    setType('contract_code')
    setKeyword('');
    setPrecise(false);
    setRole('0');
    setPageCurrent(1);
    setColOrder('contract_code');
    setColSort('asc')
    getData({
      keyword: '',
      precise: false,
      role: '0',
      pageCurrent: 1,
      type: 'contract_code',
      order: 'contract_code',
      sort: 'asc'
    });
  };

  // role
  const changeRole = (e) => {
    setRole(e.target.value);
    getData({
      role: e.target.value,
      pageCurrent: 1,
    });
  };

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  };

  // 彈出確認視窗
  const showConfirm = (id) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要續約嗎?`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        renewContract(id);
      },
      onCancel() {
      },
    });
  };

  // table
  const columns = [
    {
      title: '合約編號',
      dataIndex: 'contract_code',
      key: 'contract_code',
      sorter: true,
      render: (text, row) => {
        return (
          <Link to={`/contract/contract_song/adv/id/${row.id}`}>
            {
              (row.is_effective === '1')
                ? (text)
                : (<del>{text}</del>)
            }
          </Link>
        );
      },
    },
    {
      // 是否有關聯合約
      dataIndex: 'contract_group_name',
      key: 'contract_group_name',
      render: (text) => {
        if (text !== null) {
          return <ApartmentOutlined className={styles.om_icon_style} />;
        }
        return undefined;
      },
    },
    {
      title: '簽約對象',
      dataIndex: 'party_b_object',
      key: 'party_b_object',
      render: (text, row) => {
        if (text !== null && text !== undefined) {
          return text.map((element, idx) => <p style={{ marginBottom: '0' }} key={'pbo' + idx}>{element.name}</p>)
        }
      }
    },
    {
      // 藝人合約
      dataIndex: 'party_b_object_id',
      key: 'party_b_object_id',
      render: (text) => {
        return text !== null && (
          <Tooltip title="相關合約">
            <Link to={`/information/author/adv/${text}/contract_song`}>
              <ContainerTwoTone className={styles.om_icon_style} />
            </Link>
          </Tooltip>);
      },
    },
    {
      title: '簽約單位',
      dataIndex: 'party_b_company_name',
      key: 'party_b_company_name',
    },
    {
      title: '合約開始日',
      dataIndex: 'contract_start_date',
      key: 'contract_start_date',
      sorter: true,
    },
    {
      title: '合約到期日',
      dataIndex: 'contract_end_date',
      key: 'contract_end_date',
      sorter: true,
    },
    {
      title: '合約有效日',
      dataIndex: 'contract_expiry_date',
      key: 'contract_expiry_date',
      sorter: true,
    },
    {
      title: '續約年限',
      dataIndex: 'renewal_period',
      key: 'renewal_period',
      render: (text) => {
        return text ? parseFloat(text) : undefined;
      },
    },
    {
      title: '代理到期日',
      dataIndex: 'contract_agency_end',
      key: 'contract_agency_end',
      sorter: true,
    },
    {
      //  是否有附加檔案
      dataIndex: 'file_count',
      key: 'file_count',
      render: (text) => {
        if (text > 0) {
          return <Tooltip title="附加檔案"><PaperClipOutlined className={styles.om_icon_style} /></Tooltip>;
        }
        return undefined;
      },
    },
    {
      //  續約按鈕
      dataIndex: 'id',
      key: 'renewal_period_button',
      render: (text, row) => {
        const exDate = new Date(Date.parse(row.contract_expiry_date));
        const terDate = new Date(Date.parse(row.contract_termination_date));
        const today = new Date();
        if (row.is_effective === '1') {
          if (exDate - today < 60 * 24 * 60 * 60 * 1000 && parseFloat(row.renewal_period) && row.renewal_period !== null) {
            return <Tooltip title="續約">
              <FileAddOutlined
                className={styles.om_icon_style}
                style={{ color: '#1976D2' }}
                onClick={() => {
                  showConfirm(text);
                }}
              />
            </Tooltip>;
          }
        }
        return undefined;
      },
    },
  ];

  // changeColumn
  const changeColumn = (pagination, filters, sorter) => {
    let valOrder = sorter.columnKey;
    let valSort = (sorter.order !== undefined) ? sorter.order : '';

    // reset order, sort
    if (valSort === '') {
      valOrder = 'contract_code';
      valSort = 'asc';
    }

    setColOrder(valOrder);
    setColSort(valSort);
    getData({ order: valOrder, sort: valSort });
  };

  // 關聯合約群組＆群組顏色
  const groupList = [];
  const styleList = [
    cusStyles.group_table_row0,
    cusStyles.group_table_row1,
    cusStyles.group_table_row2,
    cusStyles.group_table_row3,
    cusStyles.group_table_row4,
    cusStyles.group_table_row5,
    cusStyles.group_table_row6,
    cusStyles.group_table_row7,
    cusStyles.group_table_row8,
    cusStyles.group_table_row9,
  ];

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
                style={{ width: 180, marginRight: '10px' }}
                value={type}
                onChange={setType}
              >
                <Option value="contract_code">合約編號</Option>
                <Option value="party_b_object_name">簽約對象</Option>
                <Option value="party_b_company_name">簽約單位</Option>
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
              onClick={() => {
                history.push('/contract/contract_song/update');
              }}
            >
              新增合約
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <RadioGroup
              className={styles.om_list_radios}
              value={role}
              onChange={changeRole}
            >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="90">90 天內</RadioButton>
              <RadioButton value="60">60 天內</RadioButton>
              <RadioButton value="30">30 天內</RadioButton>
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
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
              rowClassName={(row) => {
                const terminationDate = row.contract_termination_date ? new Date(row.contract_termination_date) : undefined;
                const exDate = row.contract_expiry_date ? new Date(row.contract_expiry_date) : undefined;
                const today = new Date();
                const className = [];
                if (terminationDate && terminationDate < today) {
                  className.push(cusStyles.disabled_table_row);
                } else if (exDate && exDate < today) {
                  className.push(cusStyles.disabled_table_row);
                } else if (row.is_effective === '0') {
                  className.push(cusStyles.disabled_table_row);
                } else if (row.contract_group_name) {
                  if (groupList.includes(row.contract_group_name) !== true) {
                    groupList.push(row.contract_group_name);
                  }
                  className.push(styleList[groupList.indexOf(row.contract_group_name)]);
                }
                return className;
              }}
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loading: loading.models.contractSongList,
}))(ContractSong);

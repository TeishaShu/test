import globalSettings from '@/fn/globalsettings';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Select,
  message,
  Modal,
  Pagination,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import { connect, history, Link } from 'umi';
import {
  PlusOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import PageHint from '@/components/PageHint';

const { confirm } = Modal;
const { Option } = Select;

const Index = props => {
  const {
    loading,
    dispatch,
    memberList: { changeId, list, role },
  } = props;

  const [keyword, setKeyword] = useState(undefined);
  const [precise, setPrecise] = useState(false);
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'memberList/fetchGetList',
      payload: {
        keyword: (obj && obj.keyword !== undefined) ? obj.keyword : keyword,
        precise: (obj && obj.precise !== undefined) ? commFn.convertBoolToNumStr(obj.precise) : commFn.convertBoolToNumStr(precise),
        page_size: parseInt(pageSize, 10),
        page_current: (obj && obj.pageCurrent) ? parseInt(obj.pageCurrent, 10) : parseInt(pageCurrent, 10),
      },
    });
  };

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  };

  // mount
  useEffect(() => {
    getData();
  }, []);

  const onFinish = (value) => {
    if (value) {
      dispatch({
        type: 'memberList/fetchSetAgent',
        payload: {agent_id: value.agentId},
        callback: res => {
          if (res && res==='設定代理人成功!'){
            message.success(res);
            setModalVisible(false);
            getData();
          }
        }
      });
    }
  };

  const accountFreezeAction = (data) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要${data.is_frozen === '0' ? '凍結' : '解凍'}嗎?`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        const freezeType = data.is_frozen === '0' ? '1' : '0';
        dispatch({
          type: 'memberList/fetchFreezeMember',
          payload: {
            id: data.id,
            is_frozen: freezeType,
          },
          callback: res => {
            if (res && (res === '凍結 帳號成功' || res === '解凍 帳號成功')) {
              message.success(res);
            }
            getData();
          },
        });
      },
      onCancel() {
      },
    });
  };
  // table
  const columns = [
    {
      dataIndex: 'is_agent',
      key: 'is_agent',
      width: '20px',
      render: text => {
        if (text === '1') {
          return <img alt="agent" src={`${REACT_APP_PUBLIC_PATH}/agent.png`}/>;
        }
        return undefined;
      },
    },
    {
      title: '帳號',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '暱稱',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: () => [
        '權限角色',
        <Link to='#'>
          <InfoCircleOutlined style={{ marginLeft: '4px', color: '#0d0d0d', fontSize: '18px' }}/>
        </Link>,
      ],
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      // 啟用
      dataIndex: 'is_frozen',
      key: 'is_frozen',
      render: (text, row) => {
        return (
          <Select
            style={text === '0' ? { color: '#70DE5F' } : { color: '#A5A5A5' }}
            bordered={false}
            value={text}
            onChange={() => accountFreezeAction(row)}
          >
            <Option value="0"><CheckCircleFilled/> 啟用</Option>
            <Option value="1"><CloseCircleFilled/> 凍結</Option>
          </Select>
        );
      },
    },
    {
      // 詳情
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return (<Link to={`/setting/member/adv/id/${text}`}>
          <span>詳情</span>
        </Link>);
      },
    },
  ];

  return (
    <Fragment>
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={16}>
              <span style={{marginRight:'16px'}}>帳號/Email/暱稱</span>
              <Input
                className={styles.om_list_keyword}
                placeholder="請輸入"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <Button
                className={styles.om_sp_m_rb}
                type="primary"
                onClick={() => {
                  setPageCurrent(1);
                  getData({
                    keyword,
                    precise,
                    pageCurrent: 1,
                  });
                }}
              >
                查詢
              </Button>
              <Button
                type="text"
                onClick={() => {
                  setKeyword('');
                  setPrecise(false);
                  setPageCurrent(1);
                  getData({
                    keyword: '',
                    precise: false,
                    pageCurrent: 1,
                  });
                }}
                icon={<ReloadOutlined/>}
              />
            </Col>
            <Col
              xs={24} md={8}
              style={{ textAlign: 'right' }}
            >
              <Button
                className={styles.om_sp_m_lb}
                onClick={() => setModalVisible(true)}
              >
                設定代理人
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined/>}
                className={styles.om_sp_m_lb}
                onClick={() => {
                  history.push('/authaccess/setting/member/add');
                }}
              >
                新增成員
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24}>
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
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
      <Modal
        title="代理人設定" // todo 如何添加subTitle
        visible={modalVisible}
        cancelText="取消"
        okText="送出"
        onOk={() => form?.submit()}
        onCancel={() => setModalVisible(false)}
        forceRender
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        closable={!loading}
      >
        <Form
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="agentId"
            label="指定成員"
            rules={[
              {
                required: true,
                message: '此欄位為必填',
              },
            ]}
          >
            <Select style={{ width: '70%' }}>
              {
                list && list.data_list.map((data) => {
                  return <Option value={data.id}>{data.account}</Option>;
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default connect(({ memberList, loading }) => ({
  memberList,
  loading: loading.models.memberList,
}))(Index);

import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Typography,
} from 'antd';
import { connect, Link } from 'umi';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styles from '@/style/style.less';
import BoxIcon from '@/components/BoxIcon';
import commFn from '@/fn/comm';

export const ComInfo = props => {
  const {
    loading,
    companyList: { info },
  } = props;

  // ui -----
  // 代結算設定
  const { Text } = Typography;
  const rightColumns = [
    {
      title: '適用作者',
      dataIndex: 'author_name',
      render: (text, row) => {
        return <Link to={`/information/author/adv/${row.author_id}/info`}>{text}</Link>
      }
    },
    {
      title: '扣佣比例(%)',
      dataIndex: 'percentage',
      render: text => {
        return <Text className={styles.om_color_green2}>{commFn.trimZero(text)}%</Text>
      }
    },
    {
      title: '預付-不扣佣',
      dataIndex: 'no_commission',
      render: text => {
        const num = Number(text);

        return !num ? (<CloseOutlined style={{ fontSize: '16px' }} className={styles.om_color_red} />) : (<CheckOutlined style={{ fontSize: '16px' }} className={styles.om_color_green2} />)
      }
    },
  ];
  const recordColumns = [
    {
      title: '適用藝人',
      dataIndex: 'author_name',
      render: (text, row) => {
        return <Link to={`/information/author/adv/${row.author_id}/info`} target="_blank">{text}</Link>
      }
    },
    {
      title: '適用合約',
      dataIndex: 'content',
      render: ary => {
        return <Fragment>{
          ary.map((element, idx) => (
            < Link
              to={`/contract/contract_author/adv/${element.contract_author_id}`}
              key={idx}
              style={{ marginRight: '10px' }}
            >
              {/* {element.contract_author_code} */}
              {(element.contract_author_subcontract_code) ? (element.contract_author_subcontract_code + ' (子約)') : (element.contract_author_code)}
              {(ary.length - 1 === idx) ? "" : ","}
            </Link>
          ))
        }</Fragment >
      }
    },
    {
      title: '扣佣比例(%)',
      dataIndex: 'percentage',
      render: text => {
        return <Text className={styles.om_color_green2}>{commFn.trimZero(text)}%</Text>
      }
    },
  ];

  // contact table
  const columns = [
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (text, row, index) => {
        return `聯絡人${index + 1}`;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '職稱',
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: '電話',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '分機',
      dataIndex: 'ext',
      key: 'ext',
    },
    {
      title: '手機',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  // boxIconList
  const boxIconList = (
    <Fragment>
      <BoxIcon list={info.type} selected="1" text="版權" />
      <BoxIcon list={info.type} selected="2" text="唱片" />
      <BoxIcon list={info.type} selected="3" text="新媒體" />
      <BoxIcon list={info.type} selected="4" text="製作" />
      <BoxIcon list={info.type} selected="5" text="其他" />
    </Fragment>
  );

  // nickname
  const renderNickname = (companyName, nickname) => {
    let findCompanyName = false;
    let nicknameArr = [];

    if (nickname) {
      for (let i = 0; i < nickname.length; i++) {
        if (!findCompanyName && companyName == nickname[i].nickname) {
          findCompanyName == true;
          continue;
        } else {
          nicknameArr.push(nickname[i].nickname);
        }
      }
      return nicknameArr.map((elem, idx) => (
        <Fragment key={idx}>
          <br />
          <span>{elem}</span>
        </Fragment>
      ));
    }

    return null;
  }
  return (
    <Fragment>
      <Card
        bordered={false}
        className={styles.card}
        title="基本資料"
        loading={loading}
        extra={boxIconList}
      >
        <Row>
          <Col md={8} xs={24}>
            <p>編號：<span>{(info.is_internal === '1') ? info.tax_id_number : info.company_code}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>公司名稱：<span>{info.name}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>公司名稱(中)：<span>{info.name_zh}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            <p>公司名稱(英)：<span>{info.name_en}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>負責人：<span>{info.admin}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>代理：<span>{(info.is_agent === '1') ? '是' : '否'}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            <p>
              公司別名：
              <span>
                {renderNickname(info.name, info.nickname)}
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>稅率：<span>{`${info.payment_rate}%`}</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        title="代結算設定"
        loading={loading}
        extra={
          <Link to={`replace_settlement`}>
            <EditOutlined className={styles.om_icon_style} />
          </Link>}
      >
        <Row>
          <Col xs={24}>
            <h4 style={{ fontWeight: 'bold' }}>詞曲</h4>
            <Table
              columns={rightColumns}
              dataSource={info.ui_replace_settle_right}
              pagination={false}
              style={{ marginBottom: '30px' }}
              className={styles.tableNoBorder}
              rowKey="id"
            />
          </Col>
          <Col xs={24}>
            <h4 style={{ fontWeight: 'bold' }}>錄音</h4>
            <Table
              columns={recordColumns}
              dataSource={info.ui_replace_settle_record}
              pagination={false}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        title="聯絡資料"
        loading={loading}
      >
        <Row>
          <Col xs={24}>
            <p>公司地址(中)：<span>{info.address_zh}</span></p>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <p>公司地址(英)：<span>{info.address_en}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            <p>郵遞區號：<span>{info.zip}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>電話：<span>{info.tel}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>傳真：<span>{info.fax}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}><p>網站：<span>{info.web}</span></p></Col>
          <Col md={8} xs={24}><p>Email：<span>{info.email}</span></p></Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        title=""
        loading={loading}
      >
        <Row>
          <Col xs={24}>
            <Table
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={info.contact}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        title=""
        loading={loading}
      >
        <Row>
          <Col xs={24}>
            <p>備註：<br />
              {
                (info.notes)
                  ? (
                    info.notes.split('\n').map((elem, idx, arr) => (
                      <span key={idx}>
                        {elem}
                        <br />
                      </span>
                    )))
                  : ('')
              }</p>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ companyList, loading }) => ({
  companyList,
  loading: loading.effects['companyList/fetchGetInfo'],
}))(ComInfo);
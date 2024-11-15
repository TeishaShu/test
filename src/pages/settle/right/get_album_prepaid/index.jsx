import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { DownloadOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Checkbox,
  Button,
  FormCompanyList,
  Space,
  Pagination,
  Tooltip,
  Table,
  Spin,
  Radio,
  Select,
  DatePicker,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import moment from 'moment';
import { template } from 'lodash';
import commFn from '@/fn/comm';
import FormAlbumNameAPI from '@/components/FormAlbumNameAPI';
import FormAuthorNameAPI from '@/components/FormAuthorNameAPI';
import { NodePanel } from 'gg-editor';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const get_album_prepaid = props => {
  const {
    loading,
    dispatch,
    match,
    enterpriseList: { agent_eid },
    settleAlbumList: { albumPrepaidChangeId, getAlbumPrepaid },
  } = props;

  const [form] = Form.useForm();
  const [viewLoading, setViewLoading] = useState(false);
  const [isNowPage, setIsNowPage] = useState(null);
  // setSelectSettlePhaseId
  const [settlePhaseIdOpt, setSettlePhaseIdOpt] = useState([]);
  const [selectSettlePhaseId, setSelectSettlePhaseId] = useState(null);
  const [selectSettlePhase, setSelectSettlePhase] = useState(null);
  // 發行期間
  const [releaseDate, setReleaseDate] = useState({
    dates: null,
    dateStart: null,
    dateEnd: null,
  });
  const releaseFormat = 'YYYY-MM';
  // 專輯名稱
  const [albumIdList, setAlbumIdList] = useState([]);
  // 作者
  const [authorList, setAuthorList] = useState([]);
  const [authorCodeLabel, setAuthorCodeLabel] = useState('');
  // page
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  // 塞選
  const [searchRange, setSearchRange] = useState('all');
  const [type, setType] = useState('0');
  // order
  const [colOrder, setColOrder] = useState('ASC');

  // mounted
  useEffect(() => {
    // 判斷選擇的頁面(本期專輯預付 or 詞曲預付扣抵餘額)
    const path = match.path;
    const statue = path.indexOf('get_now_album_prepaid') >= 0;
    setIsNowPage(statue);
    getPhaseId(statue);
    getData();
  }, []);
  // console.log('albumIdList', albumIdList)
  // mounted - 計算期別
  const getPhaseId = (isNowPageStatue) => {
    dispatch({
      type: 'settleAlbumList/fetchGetRightPhaseLists',
      payload: { type: '1', agent_eid: agent_eid, },
      callback: (result, resultNewMediaRigh) => {
        if (result != '' && result != 'error' && (isNowPageStatue !== undefined)) {
          if (result && result.length > 0) {
            const tempRes = [...result];
            if (!isNowPageStatue) {  // 詞曲預付扣抵餘額 
              tempRes.splice(0, 1)
            }
            setSettlePhaseIdOpt(tempRes.map((elem) => ({ value: elem.id, label: elem.phase })));
            setSelectSettlePhaseId(tempRes[0].id);
            setSelectSettlePhase(tempRes[0].phase);
          }
        }
      }
    });
  }

  // getData
  const getData = (obj) => {
    // console.log('obj', obj, '...', albumIdList)
    // 專輯名稱
    // setAlbumIdList([{
    //   id: (obj.album_id) ? (obj.album_id) : '',
    //   album_name_zh: (obj.album_name_zh) ? (obj.album_name_zh) : '',
    //   album_code: (obj.album_code) ? (obj.album_code) : ''
    // }]);
    // obj 轉資料格式
    let temp = {
      settle_phase_id: selectSettlePhaseId,
      release_date_start: (releaseDate && releaseDate.dates) && releaseDate.dateStart,
      release_date_end: (releaseDate && releaseDate.dates) && releaseDate.dateEnd,
      agent_eid: agent_eid,
      page_current: obj && obj.pageCurrent !== undefined ? obj.pageCurrent.toString() : pageCurrent.toString(),
      page_limit: pageSize.toString(),
      author_id: '',
      order: '',
      search_range: searchRange,
      album_name: ''
    }
    console.log('---temp', temp)
    // api
    dispatch({
      type: 'settleAlbumList/fetchGetAlbumPrepaid',
      payload: temp
    })
  }

  // search
  const onFinish = () => {
    console.log('onFinish')
    setPageCurrent(1);
    getData({
      //   type: type,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    console.log('resetQuery')
    setType('contract_code');
    setPageCurrent(1);
    setColOrder('ASC');

    getData({
      type: 'contract_code',
      pageCurrent: 1,
      order: 'release_date',
      sort: 'ASC'
    });
  }

  // 計算期別
  const changeSettlePhase = (val) => {
    setSelectSettlePhaseId(val);
  }

  // 發行期間
  const changeReleaseDate = (date) => {
    setReleaseDate({
      dates: date,
      dateStart: moment(date[0], releaseFormat).format(releaseFormat) + '-01',
      dateEnd: moment(date[1], releaseFormat).format(releaseFormat) + '-' + commFn.getMonthLastDay(date[1].format(releaseFormat)),
    })
    getData({
      releaseDateStart: moment(date[0], releaseFormat).format(releaseFormat) + '-01',
      releaseDateEnd: moment(date[1], releaseFormat).format(releaseFormat) + '-' + commFn.getMonthLastDay(date[1].format(releaseFormat)),
    });
  }

  // radio
  const changeRole = (e) => {
    setSearchRange(e.target.value);
    getData({
      searchRange: e.target.value,
      pageCurrent: 1,
    });
  }

  // select type
  const changeType = (value) => {
    setType(value);
    getData({
      type: value,
      pageCurrent: 1,
    })
  }

  // 匯出結果
  const handlerDownloadOut = () => {
    const setObj = {
      type: type,
      release_date_start: releaseDateStart,
      release_date_end: releaseDateEnd,
      page_size: pageSize.toString(),
      page_current: pageCurrent.toString(),
      order_by: colOrder,
      sort: commFn.convertOrderString(colSort)
    }
    // commFn.postDownloadFile(`${window.FRONTEND_WEB}/contract_karaoke/export_search_result`, setObj);
  }

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    if (sorter.columnKey === undefined) {
      setColOrder('ASC');
      getData({ order: 'ASC' });
    } else {
      let value = ((colOrder === 'ASC') ? 'DESC' : 'ASC');
      setColOrder(value);
      getData({ order: value });
    }
  }

  // table
  const columns = [
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
    },
    {
      title: '專輯名稱',
      dataIndex: 'album_name',
      key: 'album_name',
    },
    {
      title: '發行日期',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
      className: styles.om_bd_l_dot
    },
    {
      title: '歌曲名稱',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '作者',
      dataIndex: 'author_name',
      key: 'author_name',
      className: styles.om_bd_l_dot
    },
    {
      title: '權利',
      dataIndex: 'song_right',
      key: 'song_right',
      render: text => {
        let ary1 = text.split('(');
        let ary2 = ary1[1].split('%');
        return `${ary1[0]}(${commFn.trimZero(ary2[0])}%)`
      }
    },
    {
      title: '合約編號',
      dataIndex: 'contract_song_code',
      key: 'contract_song_code',
    },
    {
      title: '預付',
      dataIndex: 'value',
      key: 'value',
      render: text => {
        return commFn.numberWithCommas(text)
      }
    },
    {
      title: '餘額',
      dataIndex: 'balance',
      key: 'balance',
      className: isNowPage ? 'hideColumn' : styles.om_bd_l_dot,
      render: (text, row, index) => {
        const noZero = commFn.trimZero(text)
        return commFn.numberWithCommas(noZero)
      }
    },
    {
      title: '已支付',
      dataIndex: 'is_paid',
      key: 'is_paid',
      className: styles.om_bd_l_dot,
      render: text => {
        if (text !== undefined) {
          const status = (text === '0') ? false : true;
          return (<Checkbox defaultChecked={status} disabled />)
        }
      }
    },
    {
      title: '不扣傭',
      dataIndex: 'is_no_commission',
      key: 'is_no_commission',
      className: (type === '0') ? '' : 'hideColumn',
      render: text => {
        if (text !== undefined) {
          const status = (text === '0') ? false : true;
          return (<Checkbox defaultChecked={status} disabled />)
        }
      }
    },
    {
      title: '限扣此專輯',
      dataIndex: 'is_limited',
      key: 'is_limited',
      className: (type === '0') ? '' : 'hideColumn',
      render: text => {
        if (text !== undefined) {
          const status = (text === '0') ? false : true;
          return (<Checkbox defaultChecked={status} disabled />)
        }
      }
    },
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title={isNowPage ? '本期專輯預付' : '詞曲預付扣抵餘額'}
        content={isNowPage ? '' : '*預付請至企業前台設定'}
      >
        <Card bordered={false}>
          <Form
            name="search"
            onFinish={onFinish}
            style={{ display: 'inline' }}
          >
            <Row>
              <Col xs={24} md={8} >
                <span
                  className={styles.om_sp_m_rb}
                >
                  計算期別
                </span>
                {isNowPage ?
                  (<Input
                    style={{ width: '300px', }}
                    className={styles.om_sp_m_rb}
                    value={selectSettlePhase}
                    disabled
                  />)
                  :
                  (<Select
                    style={{ width: '300px', }}
                    className={styles.om_sp_m_rb}
                    value={selectSettlePhaseId}
                    onChange={(val) => {
                      changeSettlePhase(val);
                    }}
                    options={settlePhaseIdOpt}
                    className={styles.om_sp_m_rb}
                  />)}

              </Col>
              <Col xs={24} md={8}>
                <span
                  className={styles.om_sp_m_rb}
                >
                  發行期間
                </span>
                <RangePicker
                  className={styles.om_sp_m_rb}
                  format={releaseFormat}
                  picker="month"
                  allowClear={true}
                  value={(releaseDate && releaseDate.dates) && releaseDate.dates}
                  onChange={changeReleaseDate}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={8} style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
                <span
                  className={styles.om_sp_m_rb}
                >
                  專輯名稱
                </span>
                <FormAlbumNameAPI
                  form={form}
                  isName="album_name"
                  isSelectText="album_name_zh"
                  isList={albumIdList}
                  setIsList={setAlbumIdList}
                  formStyle={{ width: '300px', }}
                />
              </Col>
              <Col xs={24} lg={8} style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
                <span
                  className={styles.om_sp_m_rb}
                >
                  作者
                </span>
                <FormAuthorNameAPI
                  form={form}
                  isName="author_id"
                  isSelectText="select_author_name"
                  isList={authorList}
                  setIsList={setAuthorList}
                  authorCodeLabel={authorCodeLabel}
                  setAuthorCodeLabel={setAuthorCodeLabel}
                  // isForAuthorName={ }
                  // rules={ }
                  formStyle={{ width: '300px', }}
                />
              </Col>
              <Col xs={24} lg={8}>
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
                <Tooltip title="匯出結果">
                  <DownloadOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    onClick={handlerDownloadOut}
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={12}>
                <RadioGroup
                  className={styles.om_list_radios}
                  value={searchRange}
                  onChange={changeRole}
                >
                  <RadioButton value="all">全部專輯</RadioButton>
                  <RadioButton value="ext">外部</RadioButton>
                  <RadioButton value="tw">相信</RadioButton>
                </RadioGroup>
                <Select
                  style={{ width: 100 }}
                  value={type}
                  onChange={changeType}
                >
                  <Option value="0">內部合約</Option>
                  <Option value="1">外部合約</Option>
                </Select>
              </Col>
              <Col xs={24} md={12}>
                <Pagination
                  className={styles.om_sp_m_lb}
                  style={{ textAlign: 'right' }}
                  current={pageCurrent}
                  pageSize={pageSize}
                  total={(getAlbumPrepaid && getAlbumPrepaid.row_num) && getAlbumPrepaid.row_num}
                  onChange={changePage}
                  showSizeChanger={false}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <PageHint
                  totalItems={(getAlbumPrepaid && getAlbumPrepaid.row_num) && getAlbumPrepaid.row_num}
                  pageSize={pageSize}
                  changeId={albumPrepaidChangeId}
                />
              </Col>
            </Row>
            <Row>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                <Table
                  loading={loading}
                  pagination={false}
                  columns={columns}
                  dataSource={(getAlbumPrepaid && getAlbumPrepaid.data) && getAlbumPrepaid.data}
                  rowKey="ui_key"
                  onChange={changeColumn}
                  className={styles.mainTable}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default connect(({ enterpriseList, loading, settleAlbumList }) => ({
  enterpriseList,
  settleAlbumList,
  loading: loading.models.settleAlbumList
}))(get_album_prepaid);
import React, { useState, useEffect, Fragment } from 'react';
import { PauseCircleOutlined, ToolOutlined, CalculatorOutlined, CloseOutlined, ExceptionOutlined, ImportOutlined, FileExcelOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Radio,
  Button,
  Table,
  Tooltip,
  Select,
  DatePicker,
  Modal,
  Spin,
} from 'antd';
import { Link, connect, history } from 'umi';
import moment from 'moment';
import PageHint from '../../../components/PageHint';
import ComUpload from '../../../components/ComUpload';
// import ComReportOpModal from '../../../components/ComReportOpModal';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

export const ComAppleList = props => {
  const {
    loading,
    dispatch,
    settlePhaseList,
    exchangeRateList,
    enterpriseList,
    settleMediaList: { multiChangeId, mediaOptions, appleList },
    setCurrentStep,
    setViewLoading,
  } = props;
  const { confirm } = Modal;
  // settlePhaseId
  const [settlePhaseId, setSettlePhaseId] = useState('');
  const [defaultSettlePhaseId, setDefaultSettlePhaseId] = useState('');
  // dataPhase
  const [dataPhase, setDataPhase] = useState([]);
  const dateFormat = 'YYYY-MM-DD';
  // checkbox
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);
  // country
  const [country, setCountry] = useState('');
  // for ComReportOpModal
  /*
  const [cROpModalVisible, setCROpModalVisible] = useState(false);
  const [editCROpModalItem, setEditCROpModalItem] = useState(undefined);
  */

  // api -----
  // getData
  const getData = (obj, isInit) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('settle_record_newmedia_apple'));

    // 合併更改 ui 資料
    if (obj === null && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        settlePhaseId: getSession.settle_phase_id,
        phaseStart: getSession.data_phase_start,
        phaseEnd: getSession.data_phase_end,
        dataPhase: (!getSession.data_phase_start && !getSession.data_phase_end) ? null : ([moment(getSession.data_phase_start, dateFormat), moment(getSession.data_phase_end, dateFormat)])
      }
      delete session_ui['settle_phase_id'];
      delete session_ui['data_phase_start'];
      delete session_ui['data_phase_end'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        settlePhaseId: settlePhaseId,
        dataPhase: dataPhase
      }
      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.agent_eid) {
      setSettlePhaseId(show_ui.settlePhaseId);
      setDataPhase((!show_ui.phaseStart && !show_ui.phaseEnd) ? null : ([moment(show_ui.phaseStart, dateFormat), moment(show_ui.phaseEnd, dateFormat)]));
    }

    // obj 轉資料格式
    let temp = {
      isInit: isInit,
      settle_type: 'reco',
      settle_phase_id: (show_ui && show_ui.settlePhaseId) ? (show_ui.settlePhaseId) : settlePhaseId,
      data_phase_start: convertDate((show_ui && show_ui.dataPhase ? show_ui.dataPhase : dataPhase), true),
      data_phase_end: convertDate((show_ui && show_ui.dataPhase ? show_ui.dataPhase : dataPhase)),
      country: (show_ui && show_ui.country !== undefined) ? (show_ui.country) : (country),
      agent_eid: enterpriseList.agent_eid,
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('settle_record_newmedia_apple', tempToString);
    dispatch({
      type: 'settleMediaList/fetchMultiGetAppleList',
      payload: temp,
      callback: (settlePhaseRes) => {
        if (isInit && settlePhaseRes && settlePhaseRes.current && settlePhaseRes.current.id) {
          setSettlePhaseId((show_ui && show_ui.settlePhaseId) ? show_ui.settlePhaseId : settlePhaseRes.current.id);
          setDefaultSettlePhaseId(settlePhaseRes.current.id);
        }
      }
    });
  }

  // resetQuery
  const resetQuery = () => {
    setSettlePhaseId(defaultSettlePhaseId);
    setDataPhase([])
    setSelectedRowsArray([]);
    getData({
      settlePhaseId: defaultSettlePhaseId,
      dataPhase: []
    });
  }

  // fileImport
  const fileImport = (fileIds, dataPhase) => {
    dispatch({
      type: 'settleMediaList/fetchFileAppleImport',
      payload: {
        settle_media_file_list_id: fileIds,
        data_phase: dataPhase,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // deleteFiles
  const deleteFiles = (arr) => {
    dispatch({
      type: 'settleMediaList/fetchDeleteFiles',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        id: arr.filter((elem) => elem.indexOf('parent_') < 0)
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // runCalculate
  const runCalculate = (row) => {
    dispatch({
      type: 'settleMediaList/fetchMediaCalculate',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        company_media_id: row.company_media_id,
        file_list_id: [row.file_list_id, ...row.detail.map((elem) => (elem.settle_file_id))],
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // deleteMediaSaleData
  const deleteMediaSaleData = (row) => {
    dispatch({
      type: 'settleMediaList/fetchDeleteMediaSaleData',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        company_media_id: row.company_media_id,
        // file_list_id: row.detail.map((elem) => (elem.settle_file_id)),
        file_list_id: [row.file_list_id, ...row.detail.map((elem) => (elem.settle_file_id))],
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // mount
  useEffect(() => {
    getData(null, true);
  }, []);

  // ComReportOpModal -----
  // submit
  /*
  const handleCROpModalSubmit = (obj) => {
    let orgList = appleList.data.filter((elem) => (elem.detail && elem.detail.length > 0));
    let tmpFileList = [];

    for (let i = 0; i < orgList.length; i++) {
      tmpFileList.push(orgList[i].file_list_id);

      for (let j = 0; j < orgList[i].detail.length; j++) {
        tmpFileList.push(orgList[i].detail[j].settle_file_id);
      }
    }

    let tmpObj = {
      ...obj,
      settle_type: 'reco',
      settle_phase_id: settlePhaseId,
      is_apple: '1',
      file_list_id: tmpFileList,
      agent_eid: enterpriseList.agent_eid,
    };

    dispatch({
      type: 'settleMediaList/fetchReportSetting',
      payload: tmpObj,
      callback: (result) => {
        if (result != 'error') {
          hideCROpModal();
          getData();
        }
      }
    });
  }
  */

  //  hide
  /*
  const hideCROpModal = () => {
    setCROpModalVisible(false);
  }
  */

  // edit
  /*
  const showCROpModal = (item) => {
    setCROpModalVisible(true);
    setEditCROpModalItem(Object.assign({}, item));
  }
  */

  // ui -----
  // checkIsNowPhase
  const checkIsNowPhase = () => {
    if (settlePhaseList.newMediaRecord && settlePhaseList.newMediaRecord.current && settlePhaseList.newMediaRecord.current.id && settlePhaseId == settlePhaseList.newMediaRecord.current.id) {
      return true;
    }

    return false;
  }

  // checkIsNextPhase
  const checkIsNextPhase = () => {
    if (settlePhaseList.newMediaRecord && settlePhaseList.newMediaRecord.next && settlePhaseList.newMediaRecord.next.id && settlePhaseId == settlePhaseList.newMediaRecord.next.id) {
      return true;
    }

    return false;
  }

  // settlePhaseId
  const changeSettlePhaseId = (id) => {
    setSettlePhaseId(id);
    getData({ settlePhaseId: id });
  }

  // dataPhase
  const changeDataPhase = (date) => {
    if (!date) {
      date = [];
    }
    setDataPhase(date);
    getData({ dataPhase: date });
  }
  const convertDate = (date, isStart) => {
    if (date && date.length > 1) {
      if (isStart) {
        return date[0].format(dateFormat);
      } else {
        return date[1].format(dateFormat);
      }
    } else {
      return '';
    }
  }

  // checkbox
  const onSelectChange = (selectedRowKeys, selectRows) => {
    setSelectedRowsArray([...selectedRowKeys]);
  }

  // country
  const changeCountry = (val) => {
    setCountry(val);
    getData({ country: val });
  }

  const checkParent = (uiId) => {
    if (uiId && uiId.indexOf('parent') >= 0) {
      return true;
    }

    return false;
  }

  // table
  const columns = [
    {
      title: '平台',
      dataIndex: 'eachservice',
      key: 'eachservice',
      render: (text, row, index) => {
        return (checkParent(row.ui_id)) ? (text) : ('');
      }
    },
    {
      title: '',
      dataIndex: 'data_phase',
      key: 'data_phase',
      render: () => {
        return '';
      }
    },
    {
      title: '',
      dataIndex: 'data_phase',
      key: 'data_phase',
      render: (text, row, index) => {
        let checkUse = (row.ui_is_calcu != '1' && (checkIsNowPhase() || checkIsNextPhase())) ? (true) : (false);
        let tmpArr = (row.detail) ? (row.detail.filter((elem) => !(parseFloat(elem.report_total) > 0))).map((mElem) => mElem.settle_file_id) : ([]);
        return (
          (checkParent(row.ui_id))
            ? (
              <Tooltip title="匯入報表">
                <ImportOutlined
                  className={`${styles.om_icon_style} ${(!checkUse || tmpArr.length == 0) ? (styles.om_opacity_05) : ('')}`}
                  onClick={() => {
                    if (checkUse && tmpArr.length > 0) {
                      fileImport(tmpArr, row.data_phase);
                    }
                  }}
                />
              </Tooltip>
            )
            : (null)
        );
      }
    },
    {
      title: '報表金額(原幣別)',
      dataIndex: 'report_total',
      key: 'report_total',
      render: (text, row, index) => {
        if (row.is_imported == '1') {
          return text;
        }

        return '';
      }
    },
    {
      title: '',
      dataIndex: 'match_status',
      key: 'match_status',
      render: (text, row, index) => {
        let checkUse = false;

        if (row.is_calcu != '1' && (checkIsNowPhase() || checkIsNextPhase()) && text != 2 && row.currency_id && row.detail && row.detail.length == row.detail.filter((elem) => elem.is_imported == '1').length) {
          checkUse = true;
        }

        return (
          (checkParent(row.ui_id))
            ? (
              <Tooltip title="比對歌曲">
                <PauseCircleOutlined
                  className={
                    (text == 1)
                      ? (`${styles.om_icon_style} ${styles.om_color_yellow} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                      : (
                        (text == 2)
                          ? (`${styles.om_icon_style} ${styles.om_color_green} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                          : (`${styles.om_icon_style} ${styles.om_color_gray} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                      )
                  }
                  onClick={() => {
                    if (checkUse) {
                      setCurrentStep({ step: 'a1', list: { ...row } });
                    }
                  }}
                />
              </Tooltip>
            )
            : ('')
        );
      }
    },
    {
      title: '計算期別',
      dataIndex: 'settle_phase',
      key: 'settle_phase',
      render: (text, row, index) => {
        return (checkParent(row.ui_id)) ? (text) : ('');
      }
    },
    {
      title: '資料期別',
      dataIndex: 'data_phase',
      key: 'data_phase',
      render: (text, row, index) => {
        return (checkParent(row.ui_id) && row.currency_id != '0') ? (text) : ('');
      }
    },
    {
      title: '地區',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: '幣別',
      dataIndex: 'currency_id',
      key: 'currency_id',
      render: (text, row, index) => {
        if (checkParent(row.ui_id) && text != '0') {
          if (text && exchangeRateList.optCurrency.filter((elem) => elem.value == text).length > 0) {
            return exchangeRateList.optCurrency.filter((elem) => elem.value == text)[0]['label'];
          }

          return text;
        }

        return '';
      }
    },
    {
      title: 'Tax',
      dataIndex: 'tax_rate',
      key: 'tax_rate',
      render: (text, row, index) => {
        if (checkParent(row.ui_id) && text) {
          return text + '%';
        }

        return '';
      }
    },
    {
      title: '結算金額(台幣)',
      dataIndex: 'is_calcu',
      key: 'is_calcu',
      colSpan: 4,
      render: (text, row, index) => {
        let checkUse = (row.match_status == '2' && row.is_calcu != '1' && checkIsNowPhase()) ? (true) : (false);

        return (
          (checkParent(row.ui_id))
            ? (
              <Tooltip title="統計報表">
                <CalculatorOutlined
                  className={`${styles.om_icon_style} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`}
                  onClick={() => {
                    if (checkUse) {
                      runCalculate(row);
                    }
                  }}
                />
              </Tooltip>
            )
            : ('')
        );
      }
    },
    {
      title: '',
      dataIndex: 'settle_total',
      key: 'settle_total',
      colSpan: 0,
      render: (text, row, index) => {
        return (checkParent(row.ui_id)) ? (text) : ('');
      }
    },
    {
      title: '',
      dataIndex: 'file_list_id',
      key: 'file_list_id',
      colSpan: 0,
      render: (text, row, index) => {
        let checkUse = (row.is_calcu == '1' && checkIsNowPhase()) ? (true) : (false);

        return (
          (checkParent(row.ui_id))
            ? (
              <Tooltip title="清除資料">
                <CloseOutlined
                  className={`${styles.om_icon_style} ${styles.om_color_red} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`}
                  onClick={() => {
                    if (checkUse) {
                      deleteMediaSaleData(row);
                    }
                  }}
                />
              </Tooltip>
            )
            : ('')
        );
      }
    },
    {
      title: '',
      dataIndex: 'check_status',
      key: 'check_status',
      colSpan: 0,
      render: (text, row, index) => {
        let checkUse = (row.is_calcu == '1') ? (true) : (false);

        return (
          (checkParent(row.ui_id))
            ? (
              <Tooltip title="檢核報表">
                <ExceptionOutlined
                  className={
                    (text == '1')
                      ? (`${styles.om_icon_style} ${styles.om_color_yellow} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                      : (
                        (text == '2')
                          ? (`${styles.om_icon_style} ${styles.om_color_green} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                          : (`${styles.om_icon_style} ${styles.om_color_gray} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`)
                      )
                  }
                  onClick={() => {
                    let tmpPhaseList = (mediaOptions.settle_phase) ? (mediaOptions.settle_phase.filter((elem) => settlePhaseId == elem.id)) : ([]);

                    if (checkUse) {
                      setCurrentStep({
                        step: 'a2',
                        list: {
                          ...row,
                          ui_phase: (tmpPhaseList.length > 0) ? tmpPhaseList[0]['phase'] : '',
                          ui_phase_code: (tmpPhaseList.length > 0) ? tmpPhaseList[0]['phase_code'] : '',
                        }
                      });
                    }
                  }}
                />
              </Tooltip>
            )
            : ('')
        );
      }
    },
    {
      title: '檔名',
      dataIndex: 'file_id',
      key: 'file_id',
      render: (text, row, index) => {
        return (
          <Button
            type='link'
            onClick={() => {
              commFn.postDownloadFile(`${window.FRONTEND_WEB}/settle_media_import/download_file`, { file_id: text, agent_eid: enterpriseList.agent_eid }, row.file_name, null, true);
            }}>{row.file_name}</Button>
        );
      }
    },
  ];

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24}>
            <ComUpload
              isType="new_media"
              isDisabled={(checkIsNowPhase() || checkIsNextPhase()) ? false : true}
              setViewLoading={setViewLoading}
              getData={getData}
              isApple={true}
              phaseType={
                (checkIsNowPhase())
                  ? ('current')
                  : (
                    (checkIsNextPhase())
                      ? ('next')
                      : ('')
                  )
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <span
              className={styles.om_sp_m_rb}
            >
              計算期別
            </span>
            <Select
              className={styles.om_list_radios}
              style={{ width: 200 }}
              value={settlePhaseId}
              onChange={changeSettlePhaseId}
              options={
                (mediaOptions.settle_phase) ?
                  (mediaOptions.settle_phase.map((elem) => ({ value: elem.id, label: elem.phase })))
                  : ([])
              }
            />
            <span
              className={styles.om_sp_m_rb}
            >
              資料期別
            </span>
            <RangePicker
              className={styles.om_sp_m_rb}
              format={dateFormat}
              allowClear={true}
              value={dataPhase}
              onChange={changeDataPhase}
            />
            <Button
              className={styles.om_sp_m_rb}
              onClick={resetQuery}
            >
              重設
              </Button>
            {/* <span
              className={styles.om_sp_m_rb}
            >
              地區
            </span>
            <Select
              className={styles.om_list_radios}
              style={{ width: 200 }}
              value={country}
              onChange={changeCountry}
              options={
                (mediaOptions.country)
                  ? ([{ value: '', label: '不限' }, ...mediaOptions.country.map((elem) => ({ value: elem.country, label: elem.country }))])
                  : ([{ value: '', label: '不限' }])
              }
            /> */}
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <Tooltip title="刪除檔案">
              <FileExcelOutlined
                className={`${styles.om_icon_style} ${styles.om_color_red} ${(!checkIsNowPhase() && !checkIsNextPhase()) ? (styles.om_opacity_05) : ('')}`}
                onClick={() => {
                  if (checkIsNowPhase() || checkIsNextPhase()) {
                    if (selectedRowsArray.length == 0) {
                      commFn.errHandler('請先選取檔案');
                    } else {
                      deleteFiles(selectedRowsArray);
                    }
                  }
                }}
              />
            </Tooltip>
          </Col>
          {/* <Col
            xs={24}
            md={12}
            className={styles.om_txt_align_r}
          >
            <Tooltip title="報表設定">
              <ToolOutlined
                className={styles.om_icon_style}
                onClick={() => {
                  if (!appleList || !appleList.data || appleList.data.length == 0) {
                    commFn.errHandler('請先上傳檔案');
                  } else if (appleList.data.filter((elem) => elem.is_calcu == '1').length > 0) {
                    commFn.errHandler('已有資料執行"統計報表"，不可更改"報表設定"');
                  } else {
                    let tmpRow = appleList.data.filter((elem) => elem.detail && elem.detail.length > 0)[0];

                    showCROpModal({
                      ...tmpRow,
                      data_phase: (!tmpRow.data_phase || tmpRow.currency_id == '0') ? ('') : (tmpRow.data_phase),
                      currency_id: (tmpRow.currency_id == '0') ? ('') : (tmpRow.currency_id),
                    });
                  }
                }}
              />
            </Tooltip>
          </Col> */}
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              data={(appleList && appleList.data) ? (appleList.data) : []}
              selectTotal={selectedRowsArray}
              changeId={multiChangeId}
              isApple={true}
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
              loading={false}
              columns={columns}
              dataSource={(appleList && appleList.data) ? (appleList.data.filter((elem) => (elem.detail && elem.detail.length > 0))) : []}
              expandable={{
                childrenColumnName: 'detail',
                expandIconColumnIndex: 3,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.detail && record.detail.length > 0 ? (
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
              rowKey="ui_id"
              rowSelection={{
                selectedRowKeys: selectedRowsArray,
                type: 'checkbox',
                onChange: onSelectChange,
                checkStrictly: false,
              }}
            />
          </Col>
        </Row>
      </Card>
      {/* <ComReportOpModal
        visible={cROpModalVisible}
        editItem={editCROpModalItem}
        onCancel={hideCROpModal}
        onSubmit={handleCROpModalSubmit}
        settlePhaseOpt={
          (mediaOptions.settle_phase) ?
            (mediaOptions.settle_phase.map((elem) => ({ value: elem.id, label: elem.phase })))
            : ([])
        }
      /> */}
    </Fragment>
  );
}

export default connect(({ settlePhaseList, exchangeRateList, enterpriseList, settleMediaList, loading }) => ({
  settlePhaseList,
  exchangeRateList,
  enterpriseList,
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComAppleList);

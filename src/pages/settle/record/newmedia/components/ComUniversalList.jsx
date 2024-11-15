import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { PauseCircleOutlined, ToolOutlined, CalculatorOutlined, CloseOutlined, ExceptionOutlined, ImportOutlined, FileExcelOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Radio,
  Button,
  Pagination,
  Table,
  Tooltip,
  Select,
  DatePicker,
  Modal,
} from 'antd';
import { Link, connect, history } from 'umi';
import moment from 'moment';
import PageHint from '../../../components/PageHint';
import ComUpload from '../../../components/ComUpload';
import ComReportOpModal from '../../../components/ComReportOpModal';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

export const ComUniversalList = props => {
  const {
    loading,
    dispatch,
    settlePhaseList,
    exchangeRateList,
    enterpriseList,
    settleMediaList: { multiChangeId, mediaOptions, list },
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
  // page
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  // checkbox
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);
  // companyMediaId
  const [companyMediaId, setCompanyMediaId] = useState('');
  // country
  const [country, setCountry] = useState('');
  // for ComReportOpModal
  const [cROpModalVisible, setCROpModalVisible] = useState(false);
  const [editCROpModalItem, setEditCROpModalItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj, isInit) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('settle_record_newmedia_index'));

    // 合併更改 ui 資料
    if (obj === null && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        settlePhaseId: getSession.settle_phase_id,
        phaseStart: getSession.data_phase_start,
        phaseEnd: getSession.data_phase_end,
        dataPhase: (!getSession.data_phase_start && !getSession.data_phase_end) ? null : ([moment(getSession.data_phase_start, dateFormat), moment(getSession.data_phase_end, dateFormat)]),
        pageCurrent: parseInt(getSession.page_current) + 1,
        companyMediaId: getSession.company_media_id,
      }
      delete session_ui['page_current'];
      delete session_ui['settle_phase_id'];
      delete session_ui['company_media_id'];
      delete session_ui['data_phase_start'];
      delete session_ui['data_phase_end'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        settlePhaseId: settlePhaseId,
        dataPhase: dataPhase,
        pageCurrent: pageCurrent,
        selectedRowsArray: selectedRowsArray,
        companyMediaId: companyMediaId,
        country: country,
        cROpModalVisible: cROpModalVisible,
        editCROpModalItem: editCROpModalItem,
      }
      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.agent_eid) {
      setSettlePhaseId(show_ui.settlePhaseId);
      setDataPhase((!show_ui.phaseStart && !show_ui.phaseEnd) ? null : ([moment(show_ui.phaseStart, dateFormat), moment(show_ui.phaseEnd, dateFormat)]));
      setPageCurrent(show_ui.pageCurrent);
      setSelectedRowsArray(show_ui.selectedRowsArray);
      setCompanyMediaId(show_ui.companyMediaId);
      setCountry(show_ui.country);
      setCROpModalVisible(show_ui.cROpModalVisible);
      setEditCROpModalItem(show_ui.editCROpModalItem);
    }

    // obj 轉資料格式
    let temp = {
      isInit: isInit,
      settle_type: 'reco',
      settle_phase_id: (show_ui && show_ui.settlePhaseId) ? (show_ui.settlePhaseId) : settlePhaseId,
      data_phase_start: convertDate((show_ui && show_ui.dataPhase ? show_ui.dataPhase : dataPhase), true),
      data_phase_end: convertDate((show_ui && show_ui.dataPhase ? show_ui.dataPhase : dataPhase)),
      company_media_id: (show_ui && show_ui.companyMediaId !== undefined) ? (show_ui.companyMediaId) : (companyMediaId),
      country: (show_ui && show_ui.country !== undefined) ? (show_ui.country) : (country),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent !== undefined && Number(show_ui.pageCurrent) > 0) ? (show_ui.pageCurrent - 1).toString() : (pageCurrent - 1).toString(),
      agent_eid: enterpriseList.agent_eid,
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('settle_record_newmedia_index', tempToString);

    dispatch({
      type: 'settleMediaList/fetchMultiGetList',
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
    setPageCurrent(1);
    setSettlePhaseId(defaultSettlePhaseId);
    setCompanyMediaId('');
    setCountry('');
    setDataPhase([])
    getData({
      pageCurrent: 1,
      settlePhaseId: defaultSettlePhaseId,
      companyMediaId: '',
      country: '',
      dataPhase: []
    });
  }

  // fileImport
  const fileImport = (fileId) => {
    dispatch({
      type: 'settleMediaList/fetchFileImport',
      payload: {
        id: fileId,
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
        id: arr.slice()
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
        file_list_id: row.file_list_id,
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
        file_list_id: row.file_list_id,
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
  const handleCROpModalSubmit = (obj) => {
    let tmpObj = {
      ...obj,
      settle_type: 'reco',
      settle_phase_id: settlePhaseId,
      is_apple: '0',
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

  //  hide
  const hideCROpModal = () => {
    setCROpModalVisible(false);
  }

  // edit
  const showCROpModal = (item) => {
    setCROpModalVisible(true);
    setEditCROpModalItem(Object.assign({}, item));
  }

  // ui -----
  const checkIsNowPhase = () => {
    if (settlePhaseList.newMediaRecord && settlePhaseList.newMediaRecord.current && settlePhaseList.newMediaRecord.current.id && settlePhaseId == settlePhaseList.newMediaRecord.current.id) {
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

  // page
  const changePage = (page) => {
    setSelectedRowsArray([]);

    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // checkbox
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowsArray([...selectedRowKeys]);
  }

  // companyMediaId
  const changeCompanyMediaId = (val) => {
    setCompanyMediaId(val);
    getData({ companyMediaId: val });
  }

  // country
  const changeCountry = (val) => {
    setCountry(val);
    getData({ country: val });
  }

  // table
  const columns = [
    {
      title: '平台',
      dataIndex: 'company_media',
      key: 'company_media',
    },
    {
      title: '',
      dataIndex: 'file_id',
      key: 'file_id',
      render: (text, row, index) => {
        let checkUse = (row.is_calcu != '1' && checkIsNowPhase()) ? (true) : (false);

        return (
          <Tooltip title="報表設定">
            <ToolOutlined
              className={`${styles.om_icon_style} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`}
              onClick={() => {
                if (checkUse) {
                  showCROpModal({
                    ...row,
                    data_phase: (!row.data_phase || row.currency_id == '0') ? ('') : (row.data_phase),
                    currency_id: (row.currency_id == '0') ? ('') : (row.currency_id),
                  });
                }
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title: '',
      dataIndex: 'file_list_id',
      key: 'file_list_id',
      render: (text, row, index) => {
        let checkUse = (row.is_calcu != '1' && checkIsNowPhase()) ? (true) : (false);

        return (
          <Tooltip title="匯入報表">
            <ImportOutlined
              className={`${styles.om_icon_style} ${(!checkUse) ? (styles.om_opacity_05) : ('')}`}
              onClick={() => {
                if (checkUse) {
                  fileImport(text);
                }
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title: '報表金額(原幣別)',
      dataIndex: 'report_total',
      key: 'report_total',
    },
    {
      title: '',
      dataIndex: 'match_status',
      key: 'match_status',
      render: (text, row, index) => {
        let checkUse = (row.is_imported == '1' && row.is_calcu != '1' && checkIsNowPhase() && text != '2') ? (true) : (false);

        return (
          <Tooltip title="比對歌曲">
            <PauseCircleOutlined
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
                if (checkUse) {
                  setCurrentStep({ step: 'u1', list: { ...row } });
                }
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title: '計算期別',
      dataIndex: 'settle_phase',
      key: 'settle_phase',
    },
    {
      title: '資料期別',
      dataIndex: 'data_phase',
      key: 'data_phase',
      render: (text, row, index) => {
        if (row.currency_id == '0') {
          return '';
        }

        return text;
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
        if (text == '0') {
          return '';
        }

        if (text && exchangeRateList.optCurrency.filter((elem) => elem.value == text).length > 0) {
          return exchangeRateList.optCurrency.filter((elem) => elem.value == text)[0]['label'];
        }

        return text;
      }
    },
    {
      title: 'Tax',
      dataIndex: 'tax_rate',
      key: 'tax_rate',
      render: (text, row, index) => {
        if (text) {
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
        );
      }
    },
    {
      title: '',
      dataIndex: 'settle_total',
      key: 'settle_total',
      colSpan: 0,
    },
    {
      title: '',
      dataIndex: 'file_id',
      key: 'file_id',
      colSpan: 0,
      render: (text, row, index) => {
        let checkUse = (row.is_calcu == '1' && checkIsNowPhase()) ? (true) : (false);

        return (
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
                    step: 'u2',
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
              isDisabled={(checkIsNowPhase()) ? false : true}
              setViewLoading={setViewLoading}
              getData={getData}
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
            <span
              className={styles.om_sp_m_rb}
            >
              平台
            </span>
            <Select
              className={styles.om_list_radios}
              style={{ width: 200 }}
              value={companyMediaId}
              onChange={changeCompanyMediaId}
              options={
                (mediaOptions.company)
                  ? ([{ value: '', label: '不限' }, ...mediaOptions.company.map((elem) => ({ value: elem.id, label: elem.company_name }))])
                  : ([{ value: '', label: '不限' }])
              }
            />
            <span
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
            />
            <Button
              className={styles.om_sp_m_rb}
              onClick={resetQuery}
            >
              重設
              </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={16}>
            <Tooltip title="刪除檔案">
              <FileExcelOutlined
                className={`${styles.om_icon_style} ${styles.om_color_red} ${(!checkIsNowPhase()) ? (styles.om_opacity_05) : ('')}`}
                onClick={() => {
                  if (checkIsNowPhase()) {
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
          <Col xs={24} md={8}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={list.count}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              data={list.data}
              selectTotal={selectedRowsArray}
              changeId={multiChangeId}
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
              dataSource={list.data}
              rowKey="file_list_id"
              rowSelection={{
                selectedRowKeys: selectedRowsArray,
                type: 'checkbox',
                onChange: onSelectChange,
              }}
            />
          </Col>
        </Row>
      </Card>
      <ComReportOpModal
        visible={cROpModalVisible}
        editItem={editCROpModalItem}
        onCancel={hideCROpModal}
        onSubmit={handleCROpModalSubmit}
        settlePhaseOpt={
          (mediaOptions.settle_phase) ?
            (mediaOptions.settle_phase.map((elem) => ({ value: elem.id, label: elem.phase })))
            : ([])
        }
      />
    </Fragment>
  );
}

export default connect(({ settlePhaseList, exchangeRateList, enterpriseList, settleMediaList, loading }) => ({
  settlePhaseList,
  exchangeRateList,
  enterpriseList,
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComUniversalList);

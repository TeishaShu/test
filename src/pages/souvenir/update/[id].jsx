import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  InputNumber,
  Checkbox,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';
import errorStyles from '@/style/error_style.less';
import ComAuthor from './components/ComAuthor';
import FooterToolbar from '@/components/FooterToolbar';

const { Option } = Select;

export const update = props => {
  const {
    dispatch,
    match,
    loadingGetInfo,
    loadingAddSouvenirForm,
    loadingEditSouvenirForm,
    souvenirList: { changeId, optType, info },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const dateFormat = 'YYYY-MM-DD';
  const [viewLoading, setViewLoading] = useState(false);
  const [authorIdList, setAuthorIdList] = useState([]);
  const [contractList, setContractList] = useState([]);

  // api -----
  // getData
  const getData = (editId) => {
    dispatch({
      type: 'souvenirList/fetchGetInfo',
      payload: {
        id: editId,
      },
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      souvenir: {
        id: '',
        souvenir_code: '',
        souvenir_name: '',
        souvenir_type_id: '1',
        souvenir_price: '',
        souvenir_launch_day: '',
      },
      // only for get api
      /*
      souvenir_split_ratio: {
        data: [],
      },
      */
      author: [], // only for set api
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else {
      setIsEdit(false);
    }
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    if (match.params.id) {
      let objSouvenir = Object.assign({}, (info && info.souvenir) ? (info && info.souvenir) : {});
      let arrSplitRatio = (info && info.souvenir_split_ratio && info.souvenir_split_ratio.data && info.souvenir_split_ratio.data.length > 0) ? (info.souvenir_split_ratio.data.slice()) : [];
      let tmpSouvenirObj = {
        souvenir_code: (objSouvenir && objSouvenir.souvenir_code) ? (objSouvenir.souvenir_code) : (''),  // 編號
        souvenir_name: (objSouvenir && objSouvenir.souvenir_name) ? (objSouvenir.souvenir_name) : (''),  // 名稱
        souvenir_price: (objSouvenir && objSouvenir.souvenir_price) ? (objSouvenir.souvenir_price) : (''),  // 售價
        souvenir_type_id: (objSouvenir && objSouvenir.souvenir_type_id) ? (objSouvenir.souvenir_type_id) : (''),  // 型態
        souvenir_launch_day: (typeof (objSouvenir.souvenir_launch_day) == 'string') ? (objSouvenir.souvenir_launch_day != '' ? moment(objSouvenir.souvenir_launch_day) : null) : objSouvenir.souvenir_launch_day,  // 首發日
      };

      // 拆分比例
      let tmpSplitRatio = [];
      let tmpAuthorIdList = [];
      if (arrSplitRatio && arrSplitRatio.length > 0) {
        for (let i = 0; i < arrSplitRatio.length; i++) {
          // for form
          let item = {
            souvenir_split_ratio_id: (arrSplitRatio[i].id) ? (arrSplitRatio[i].id) : '',
            author_stage_name_id: (arrSplitRatio[i].author_stage_name_id) ? (arrSplitRatio[i].author_stage_name_id) : '',
            author_id: (arrSplitRatio[i].author_id) ? (arrSplitRatio[i].author_id) : '',
            author_name: (arrSplitRatio[i].stage_name) ? (arrSplitRatio[i].stage_name) : '',
            author_code: '',  // TODO: 缺少
            numerator: (arrSplitRatio[i].numerator) ? (arrSplitRatio[i].numerator) : '',
            denominator: (arrSplitRatio[i].denominator) ? (arrSplitRatio[i].denominator) : '',
            contract_author_id: (arrSplitRatio[i].contract_author_id) ? (arrSplitRatio[i].contract_author_id) : '',
            subcontract_id: (arrSplitRatio[i].contract_author_subcontract_id) ? (arrSplitRatio[i].contract_author_subcontract_id) : '',
          }
          tmpSplitRatio.push(item);
          // for author option
          let optItem = [{
            id: (arrSplitRatio[i].author_stage_name_id) ? (arrSplitRatio[i].author_stage_name_id) : '',
            stage_name: (arrSplitRatio[i].stage_name) ? (arrSplitRatio[i].stage_name) : '',
            author_id: (arrSplitRatio[i].author_id) ? (arrSplitRatio[i].author_id) : '',
            author_code: '',  // TODO: 缺少
          }];
          tmpAuthorIdList.push(optItem);
        }
      }

      form.setFieldsValue({
        souvenir: tmpSouvenirObj,
        author: tmpSplitRatio,
      });
      setAuthorIdList(tmpAuthorIdList);

      // 適用合約選項
      let souvenirLanchDay = form.getFieldValue()['souvenir']['souvenir_launch_day'];
      if (valid.checkDateRequired(souvenirLanchDay)) {
        requestContractAuthorList(souvenirLanchDay.format(dateFormat));
      }
    }
  }, [changeId]);

  // requestContractAuthor
  const requestContractAuthor = (author_id, date) => {
    return new Promise((resolve, reject) => {
      // TODO: init 的日期
      fetch(`${window.FRONTEND_WEB}/contract_author/contracts_belong_to_author?author_id=${author_id}&release_date=${(date) ? (date) : (info.release_date)}`)
        .then(res => res.json())
        .then(jsonData => {
          resolve(
            (jsonData.data)
              ? (jsonData.data.filter((e) => {
                return e.contract_author && e.contract_author.is_delete == '0'
              }))
              : ([])
          );
        }).catch(err => {
          resolve([]);
        });
    });
  }

  const requestContractAuthorList = (date) => {
    setViewLoading(true);

    let urls = form.getFieldValue()['author'].map((elem) => (elem.author_id) ? (elem.author_id) : null);
    let requests = urls.map(url => requestContractAuthor(url, (date) ? (date) : null));
    let tmpContractList = [];

    Promise.all(requests).then(res => {
      for (let m = 0; m < res.length; m++) {
        let tmpContractOpt = [];
        for (let n = 0; n < res[m].length; n++) {
          let tmpContractItem = {
            ...res[m][n],
            label: res[m][n].contract_author.contract_code,
            value: res[m][n].contract_author.id,
            subcontract_id: res[m][n].subcontract_id,
            parent_author_id: res[m][n].subcontract_parent_author_id,
          }
          tmpContractOpt.push(tmpContractItem);
        }
        tmpContractList.push(tmpContractOpt);
      }

      setContractList(tmpContractList);

      setViewLoading(false);
    });
  }

  // save
  const onFinish = values => {
    setError([]);

    let saveOrgObj = Object.assign({}, values);
    let tmpSaveObj = {
      souvenir: (saveOrgObj.souvenir) ? ({ ...saveOrgObj.souvenir }) : null,
      author: (saveOrgObj.author) ? (saveOrgObj.author.map((elem) => ({ ...elem, author_id: (elem.author_id) ? (elem.author_id) : null, contract_author_id: (elem.contract_author_id) ? (elem.contract_author_id) : null, subcontract_id: (elem.subcontract_id && elem.subcontract_id != '0') ? (elem.subcontract_id) : (null) }))) : [],
    };
    tmpSaveObj.souvenir.souvenir_id = match.params.id;

    // souvenir_launch_day
    if (tmpSaveObj.souvenir && tmpSaveObj.souvenir.souvenir_launch_day && typeof (tmpSaveObj.souvenir.souvenir_launch_day) == 'object') {
      tmpSaveObj.souvenir.souvenir_launch_day = tmpSaveObj.souvenir.souvenir_launch_day.format(dateFormat);
    } else {
      tmpSaveObj.souvenir.souvenir_launch_day = null;
    }

    dispatch({
      type: (isEdit) ? 'souvenirList/fetchEditSouvenirForm' : 'souvenirList/fetchAddSouvenirForm',
      payload: tmpSaveObj,
      callback: res => {
        if (res && res != 'error') {
          history.push('/souvenir');
        }
      }
    });
  };

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    souvenir_souvenir_code: '編號',
    souvenir_souvenir_name: '名稱',
    souvenir_souvenir_price: '售價',
    souvenir_souvenir_type_id: '型態',
    souvenir_souvenir_launch_day: '首發日',
    split_table: {
      author_stage_name_id: '藝名',
      numerator: '比例 (分子)',
      denominator: '比例 (分母)',
    },
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['author_stage_name_id', 'numerator', 'denominator'];
    const cusFieldId = 'split_table';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey === cusFieldId) {
        labelNode = document.getElementById(cusFieldId);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      // for custom souvenir field
      let key = (err.name.length == 2) ? (err.name.join('_')) : (err.name[0]);
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }
      }

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i++) {
          if (key.indexOf(cusFields[i]) >= 0) {
            renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
            break;
          }
        }

        renderSelector = cusFieldId;
      }

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon} />
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  // ui -----
  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push('/souvenir');
      },
      onCancel() { },
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={(isEdit) ? (loadingEditSouvenirForm || loadingGetInfo || viewLoading) : (loadingAddSouvenirForm || viewLoading)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯明星商品' : '新增明星商品'}
        >
          <Card
            bordered={false}
            className={styles.card}
            title="基本資料"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name={['souvenir', 'souvenir_code']}
                  label={fieldLabels.souvenir_souvenir_code}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    disabled={(isEdit) ? true : false}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name={['souvenir', 'souvenir_name']}
                  label={fieldLabels.souvenir_souvenir_name}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name={['souvenir', 'souvenir_price']}
                  label={fieldLabels.souvenir_souvenir_price}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name={['souvenir', 'souvenir_type_id']}
                  label={fieldLabels.souvenir_souvenir_type_id}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={optType}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name={['souvenir', 'souvenir_launch_day']}
                  label={fieldLabels.souvenir_souvenir_launch_day}
                  initialValue={null}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={(val) => {
                      let tmpContractList = contractList.slice();
                      let arrAddEdit = form.getFieldsValue().author.slice();

                      // clear contractAuthor option
                      tmpContractList = tmpContractList.map(() => []);
                      setContractList(tmpContractList);

                      // clear contractAuthor val
                      arrAddEdit = arrAddEdit.map((elem) => ({ ...elem, contract_author_id: '', subcontract_id: '' }));
                      form.setFieldsValue({ author: arrAddEdit });

                      // 重新抓取 contractAuthor option
                      if (valid.checkDateRequired(val)) {
                        requestContractAuthorList(val.format(dateFormat));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <ComAuthor
            form={form}
            fieldLabels={fieldLabels}
            setViewLoading={setViewLoading}
            authorIdList={authorIdList}
            setAuthorIdList={setAuthorIdList}
            contractList={contractList}
            setContractList={setContractList}
            requestContractAuthor={requestContractAuthor}
            dateFormat={dateFormat}
          />
        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            onClick={() => form?.submit()}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
};

export default connect(({ souvenirList, loading }) => ({
  souvenirList,
  loadingGetInfo: loading.effects['souvenirList/fetchGetInfo'],
  loadingAddSouvenirForm: loading.effects['souvenirList/fetchAddSouvenirForm'],
  loadingEditSouvenirForm: loading.effects['souvenirList/fetchEditSouvenirForm'],
}))(update);
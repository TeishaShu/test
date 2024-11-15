import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Button,
  Modal,
  Spin,
  Upload,
  message,
  DatePicker,
  Popover,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import styles from '@/style/style.less';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_TW';
import FormArea from '@/components/FormArea';
import FormCompanyNicknameAPI from '@/components/FormCompanyNicknameAPI';
import FormCompanyNameAPI from '@/components/FormCompanyNameAPI';
import errorStyles from '@/style/error_style.less';
import FormContractGroup from '@/pages/contract/contract_song/update/components/FormContractGroup';
import FormCompanyNickNameAuthorName from '@/components/FormCompanyNickNameAuthorName';
import FormCommission from './components/FormCommission';
import FormCompanyList from './components/FormCompanyList';

const { TextArea } = Input;

export const Update = props => {
  const {
    dispatch,
    match,
    loading,
    contractSongList: { optCurrency, info, optInsurance, optInsurance2, contractGroupList },
    authorizedCountryList,
    authorizedAreaList,
  } = props;

  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditContract, setIsEditContract] = useState(false);
  const [terminationDate, setTerminationDate] = useState('0');
  const [earlyTerminationDate, setEarlyTerminationDate] = useState('0');
  const [contractGroup, setContractGroup] = useState([]);
  const [contractGroupArr, setContractGroupArr] = useState([]);
  const [upFileList, setUpFileList] = useState([]);
  const [isPermanent, setIsPermanent] = useState('0');
  const [isTransfer, setIsTransfer] = useState('0');
  // for area
  const [initAgencyArea, setInitAgencyArea] = useState(true);
  const [initAgencyAreaList, setInitAgencyAreaList] = useState([]);
  const [agencyAreaCountry2Disabled, setAgencyAreaCountry2Disabled] = useState(false);
  // for company
  const [spCompanyCodeLabel, setSpCompanyCodeLabel] = useState('');
  const [spCompanyList, setSpCompanyList] = useState([]);
  const [partyACompanyIdList, setPartyACompanyIdList] = useState([]);
  const [partyACompanyIdCodeLabel, setPartyACompanyIdCodeLabel] = useState('');
  const [partyBObjectIdList, setPartyBObjectIdList] = useState([]);
  const [partyBObjectIdCodeLabel, setPartyBObjectIdCodeLabel] = useState([]);
  const [partyBCompanyIdList, setPartyBCompanyIdList] = useState([]);
  const [partyBCompanyIdCodeLabel, setPartyBCompanyIdCodeLabel] = useState('');
  // for op
  const [opSelectVal, setOpSelectVal] = useState('1');
  const [opNicknameList, setOpNicknameList] = useState([]);
  const [opNicknameCodeLabel, setOpNicknameCodeLabel] = useState('');
  const [opAuthorList, setOpAuthorList] = useState([]);
  const [opAuthorCodeLabel, setOpAuthorCodeLabel] = useState('');


  const dateFormat = 'YYYY-MM-DD';
  // fieldLabels
  const fieldLabels = {
    contract_code: '合約編號',
    party_b_object: '簽約對象',
    contract_start_date: '合約開始日',
    contract_agency_end: '代理到期日提前終止',
    contract_end_date: '合約到期日',
    commission: '比例',
  };

  // 回填頁面資料
  const updateData = () => {
    const area = info.authorized_area.map((data) => {
      return data.country_id;
    });
    setIsTransfer(info.is_transfer);
    setIsPermanent(info.is_permanent);
    setInitAgencyArea(!!isEdit);
    // component補預設值
    if (info.op) {
      if (info.op && info.op.select_type === '1') {
        form.setFieldsValue({ op_nickname_id: info.op.id });
        setOpSelectVal(info.op.select_type);
        setOpNicknameList([info.op]);
        setOpNicknameCodeLabel(info.op.company_code);
      }
      if (info.op && info.op.select_type === '2') {
        form.setFieldsValue({ op_author_id: info.op.id });
        setOpSelectVal(info.op.select_type);
        setOpAuthorList([info.op]);
        setOpAuthorCodeLabel(info.op.author_code);
      }
    }
    if (info.sp) {
      setSpCompanyList([info.sp]);
      setSpCompanyCodeLabel(info.sp.company_code);
    }
    if (info.party_a_company) {
      setPartyACompanyIdList([info.party_a_company]);
      setPartyACompanyIdCodeLabel(info.party_a_company.company_code);
    }

    // 簽約對象 
    let party_b_newAryList = []; // 總資料
    let newAryCode = []; // ui author_code
    let party_b_idAry = []; // ui author_id
    if (info.party_b_object && info.party_b_object.length > 0) {
      info.party_b_object.forEach(el => {
        if (el.is_delete !== '1' && el.author_code !== '') {
          party_b_newAryList.push([{ ...el, id: el.author_id }]);
          newAryCode.push(el.author_code);
        }
      });
      setPartyBObjectIdList(party_b_newAryList);
      setPartyBObjectIdCodeLabel(newAryCode);

      // ui author_id： Pay attention to the format here!
      party_b_idAry = info.party_b_object.map(p => {
        return { author_id: p.author_id }
      });
      form.setFieldsValue({ party_b_object: party_b_idAry });
    }

    if (info.party_b_company) {
      setPartyBCompanyIdList([info.party_b_company]);
      setPartyBCompanyIdCodeLabel(info.party_b_company.company_code);
    }

    setAgencyAreaCountry2Disabled(info.authorized_area_type === '2');
    setContractGroup(info.contract_group_name && info.contract_group_name !== null ? info.contract_group_name : []);
    setContractGroupArr(info.contract_group.length > 0 ? [{
      contract_group_name: info.contract_group_name,
      contract_group: info.contract_group,
    }] : []);
    setIsEditContract(info.contract_group.length > 0);
    setTerminationDate(info.contract_termination_date ? '1' : '0');
    setEarlyTerminationDate(info.is_early_terminate);
    setUpFileList(info.file !== null ? info.file.map((data) => {
      return {
        ...data,
        uid: data.id,
        name: data.orig_name,
        url: `${window.FRONTEND_WEB}/contract_song/download_file?file_id=${data.id}`,
      };
    }) : []);

    // 設定授權地區初始顯示項目
    if (['2', '3', '4'].includes(info.authorized_area_type) && info.authorized_area_id && info.authorized_area_name) {
      setInitAgencyAreaList([{ id: info.authorized_area_id, area_name: info.authorized_area_name.split(',', 1) }]);
    }

    let authorizedAreaType;
    if (info.authorized_area_type) {
      authorizedAreaType = ['2', '3', '4'].includes(info.authorized_area_type) ? '0' : '1';
    } else {
      authorizedAreaType = undefined;
    }

    if (info.is_transfer === '0' && info.is_permanent === '0') {
      form.setFieldsValue({
        contract_agency_end: info.contract_agency_end ? moment(info.contract_agency_end, dateFormat) : '',
        agency_renew: info.agency_renew === '1' ? '1' : '0',
        is_termination: info.contract_termination_date ? '1' : '0',
        is_early_terminate: info.is_early_terminate ?? '0',
        contract_termination_date: info.contract_termination_date ? moment(info.contract_termination_date, dateFormat) : '',
        early_terminate_date: info.early_terminate_date ? moment(info.early_terminate_date, dateFormat) : '',
        contract_end_date: info.contract_end_date ? moment(info.contract_end_date, dateFormat) : '',
        contract_expiry_date: info.contract_expiry_date ? moment(info.contract_expiry_date, dateFormat) : '',
        agency_year: info.agency_year ? parseFloat(info.agency_year) : '',
        renewal_period: info.renewal_period ? parseFloat(info.renewal_period) : '',
      });
    }

    // commission
    let tmpCommission = form.getFieldValue('commission').slice();
    if (info.commission) {
      for (let i = 0; i < info.commission.length; i++) {
        let comItem = info.commission[i];
        let comItemNum = parseInt(comItem.key) - 1;
        let nullNum = 2;

        for (let j = 0; j < comItem.percentage.length; j++) {
          let perItem = comItem.percentage[j];

          if (perItem.authorized_country_id == '229') {
            tmpCommission[comItemNum].percentage[0] = { ...perItem };
          } else if (perItem.authorized_country_id == '0') {
            tmpCommission[comItemNum].percentage[1] = { ...perItem };
          } else {
            if (tmpCommission[comItemNum].percentage[nullNum] && !tmpCommission[comItemNum].percentage[nullNum].authorized_country_id) {
              tmpCommission[comItemNum].percentage.splice(nullNum, 1);
              tmpCommission[comItemNum].percentage.push({ ...perItem });
            }
          }
        }
      }
    }

    form.setFieldsValue({
      contract_code: info.contract_code,
      contract_signing_date: info.contract_signing_date ? moment(info.contract_signing_date, dateFormat) : undefined,
      party_a_company_id: info.party_a_company ? info.party_a_company.id : '',
      party_b_company_id: info.party_b_company ? info.party_b_company.id : '',
      contract_group_name: info.contract_group_name ?? [],
      sp_nickname_id: info.sp ? info.sp.id : '',
      contract_start_date: info.contract_start_date ? moment(info.contract_start_date, dateFormat) : '',
      is_permanent: info.is_permanent ?? '',
      is_transfer: info.is_transfer ?? '',
      notes: info.notes ?? '',
      authorized_area_type_radio: authorizedAreaType,
      authorized_area_id: info.authorized_area_type !== '1' && info.authorized_area_id ? info.authorized_area_id : '',
      authorized_area_type_select: info.authorized_area_type !== '1' ? info.authorized_area_type : '',
      authorized_area_id_input_countrys: info.authorized_area_type === '1' ? area : [],
      authorized_area_id_input2_countrys: ['3', '4'].includes(info.authorized_area_type) ? area : [],
      select: info.currency_id ?? '',
      commission: tmpCommission,
    });
  };

  // api -----
  // getData
  const getData = (pageId) => {
    dispatch({
      type: 'contractSongList/fetchGetInfo',
      payload: {
        id: pageId,
      },
    });
  };

  const getAutocomplete = () => {
    dispatch({
      type: 'contractSongList/fetchMultiGetAutocomplete',
    });
    dispatch({
      type: 'contractSongList/fetchContractGroupList',
    });
  };

  // 更新/新增
  const updateContractSong = (payload) => {
    dispatch({
      type: isEdit ? 'contractSongList/fetchEditForm' : 'contractSongList/fetchAddForm',
      payload,
      callback: res => {
        if (res && res.data !== undefined) {
          upFileList.forEach((elem) => {
            if (elem.status === 'removed') {
              const elemId = elem.response ? elem.response.data : elem.id;
              if (elemId) {
                dispatch({
                  type: 'contractSongList/fetchDeleteFile',
                  payload: {
                    id: elemId,
                    fk_id: isEdit ? info.id : res.data,
                  },
                  callback: delRes => {
                    if (delRes && delRes.data !== true) {
                      message.error('附件刪除失敗');
                    }
                  },
                });
              }
            }
            if (elem.status === 'done') {
              const elemName = elem.response ? elem.response.data.name : undefined;
              if (elemName) {
                dispatch({
                  type: 'contractSongList/updateFile',
                  payload: {
                    tmp_file_name: elemName,
                    fk_id: isEdit ? info.id : res.data,
                  },
                  callback: updateRes => {
                    if (updateRes && updateRes.data !== true) {
                      message.error('附件更新失敗');
                    }
                  },
                });
              }
            }
          });
          message.success(isEdit ? '更新成功' : '新增成功');
          const redirect = isEdit ? `/contract/contract_song/adv/id/${info.id}` : `/contract/contract_song/adv/id/${res.data}`;
          history.push(redirect);
        }
      },
    });
  };

  const clearGruop = (id) => {
    dispatch({
      type: 'contractSongList/delContractGroup',
      payload: { id },
      callback: res => {
        if (res && res.data === true) {
          getData(match.params.id);
          setIsEditContract(false);
          setContractGroupArr([]);
          setContractGroup([]);
        }
      },
    });
  };


  // mount
  useEffect(() => {
    // commission
    const initObj = {
      commission: [
        {
          key: '1',
          name: 'Mechani.',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
        {
          key: '2',
          name: 'PrintMu.',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
        {
          key: '3',
          name: 'Synchon',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
        {
          key: '4',
          name: 'Performa',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
        {
          key: '5',
          name: 'Digital',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
        {
          key: '6',
          name: 'Others',
          percentage: [
            { authorized_country_id: '229', value: '' },
            { authorized_country_id: '0', value: '' },
            { authorized_country_id: '', value: '' },
          ],
        },
      ],
    };
    form.setFieldsValue({ commission: initObj.commission.slice() });

    // 簽約對象
    let default_party_b_object = {
      author_id: '',
    };
    form.setFieldsValue({
      party_b_object: [default_party_b_object],
    });

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else {
      setIsEdit(false);
    }
    getAutocomplete();
    // 設定國家清單
  }, [match.params.id]);


  useEffect(() => {
    if (isEdit) {
      updateData();
      getAutocomplete();
    }
  }, [info]);
  // confirm
  const showConfirm = (showType) => {
    let content;
    switch (showType) {
      case 'add':
        content = '取消新增';
        break;
      case 'edit':
        content = '取消修改';
        break;
      case 'delContractGroup':
        content = '清除關聯';
        break;
      default:
        break;
    }
    confirm({
      title: '',
      icon: '',
      content: `確定要${content}嗎？`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        switch (showType) {
          case 'add':
            history.push('/contract/contract_song');
            break;
          case 'edit':
            history.push(`/contract/contract_song/adv/id/${info.id}`);
            break;
          case 'delContractGroup':
            clearGruop(info.id);
            break;
          default:
            break;
        }
      },
      onCancel() {
      },
    });
  };

  // 將日期轉為格式字串
  const fixDate = (date) => {
    if (date) {
      return date.format(dateFormat);
    }
    return undefined;
  };

  // 表單完成submit動作
  const onFinish = values => {
    const payload = { ...values };
    payload.contract_signing_date = fixDate(values.contract_signing_date);
    payload.contract_start_date = fixDate(values.contract_start_date);
    payload.contract_end_date = fixDate(values.contract_end_date);
    payload.contract_agency_end = fixDate(values.contract_agency_end);
    payload.contract_expiry_date = fixDate(values.contract_expiry_date);
    payload.contract_termination_date = fixDate(values.contract_termination_date);
    payload.early_terminate_date = fixDate(values.early_terminate_date);
    if (isEdit) {
      payload.id = info.id;
    }
    if (values.is_early_terminate === '0') {
      payload.early_terminate_date = null;
    }
    if (values.is_termination === '0') {
      payload.contract_termination_date = null;
    }

    // 當為永久or轉讓時將「合約到期日」、「合約有效日」、「續約年限」、「代理到期日」、「合約提前終止日」、「代理到日提前終止」清除
    if (isTransfer === '1' || isPermanent === '1') {
      payload.is_early_terminate = '0';
      payload.contract_end_date = null;
      payload.contract_agency_end = null;
      payload.contract_expiry_date = null;
      payload.contract_termination_date = null;
      payload.early_terminate_date = null;
    }

    // 關聯合約
    if (typeof contractGroup === 'string') {
      delete payload.contract_group;
      payload.contract_group_name = contractGroup;
    } else {
      delete payload.contract_group_name;
      payload.contract_group = contractGroupList ? contractGroupList.filter((data) => {
        return contractGroup.includes(data.contract_code);
      }).map((data => data.id)) : [];
    }

    // 扣佣
    const convertCommission = [];
    for (let i = 0; i < payload.commission.length; i++) {
      const comItem = payload.commission[i].percentage;
      for (let j = 0; j < comItem.length; j++) {
        if (comItem[j].authorized_country_id) {
          const newItem = {};
          newItem.commission_type_id = payload.commission[i].key;
          newItem.authorized_country_id = comItem[j].authorized_country_id ? comItem[j].authorized_country_id : '0';
          newItem.percentage = (comItem[j].value) ? (comItem[j].value) : null;
          convertCommission.push(newItem);
        }
      }
    }
    payload.commission = convertCommission;

    // 授權地區
    if (payload.authorized_area_type_radio === '1') {
      payload.authorized_area_type = '1';
    } else {
      payload.authorized_area_type = payload.authorized_area_type_select;
    }
    if (payload.authorized_area_type === '1') {
      payload.authorized_area = payload.authorized_area_id_input_countrys;
    }
    if (['2', '3', '4'].includes(payload.authorized_area_type)) {
      payload.authorized_area = payload.authorized_area_id_input2_countrys;
    }
    delete payload.authorized_area_id_input_countrys;
    delete payload.authorized_area_id_input2_countrys;
    delete payload.authorized_area_type_radio;
    delete payload.authorized_area_type_select;

    // 判斷op選擇類型 刪除另外一項
    if (opSelectVal === '1') {
      delete payload.op_author_id;
    }
    if (opSelectVal === '2') {
      delete payload.op_nickname_id;
    }

    // 簽約對象
    if (payload.party_b_object && payload.party_b_object.length > 0) {
      let filterAry = payload.party_b_object.filter(p => p.is_delete !== '1')
      let tempAry = filterAry.map(p => p.author_id);
      payload.party_b_objects = tempAry;
    }
    delete payload.party_b_object;
    updateContractSong(payload);
  };

  // valid behavior -----

  // valid
  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['song_code'];
    const cusFieldId = 'song_table';

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

      let key = err.name[0];
      let renderFieldName = fieldLabels[key];

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i += 1) {
          if (i > 0) {
            key += `_${err.name[i]}`;
          } else {
            key += err.name[i];
          }
        }
      }

      let renderSelector = key;

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i += 1) {
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

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '修改詞曲合約' : '新增詞曲合約'}
        >
          <Card
            bordered={false}
            className={styles.card}
            title={
              <div>附件
                <span
                  style={{ fontSize: '10px', color: '#a4a2a2', marginLeft: '10px' }}>只支援 .pdf 檔案格式，單一檔案容量須小於5MB</span>
              </div>
            }
          >
            <Upload
              action={`${window.FRONTEND_WEB}/contract_song/upload_file`}
              accept='.pdf'
              listType="text"
              fileList={upFileList ? upFileList.filter(file => file.status !== 'removed') : []}
              beforeUpload={(file) => {
                if (file.size / 1024 / 1024 > 5) {
                  message.error(`檔案大小超過限制 5MB`);
                }
                return file.size / 1024 / 1024 < 5;
              }}
              onChange={({ file }) => {
                setUpFileList([...upFileList.filter(data => data.uid !== file.uid), file]);
              }}
              data={file => {
                return { files: [file] };
              }}
            >
              <Button icon={<UploadOutlined />}>上傳檔案</Button>
            </Upload>
          </Card>
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
                  label="合約編號"
                  name="contract_code"
                  initialValue={isEdit ? info.contract_code : ''}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                    { pattern: /^[\u0021\u0023-\u0026\u0028-\u007E]+$/, message: '格式錯誤' },
                  ]}
                >
                  <Input disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="簽約日期"
                  name="contract_signing_date"
                >
                  <DatePicker locale={locale} format={dateFormat} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel="我方簽約單位"
                  isName="party_a_company_id"
                  isSelectText="party_a_company_text"
                  isList={partyACompanyIdList}
                  setIsList={setPartyACompanyIdList}
                  cpCodeLabel={partyACompanyIdCodeLabel}
                  setCpCodeLabel={setPartyACompanyIdCodeLabel}
                />
              </Col>
            </Row>
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <div className={styles.contentBBd} />
              </Col>
            </Row>
            <Row gutter={[64, 24]} style={{ paddingTop: '40px' }}>
              <Col xs={24} lg={8}>
                <FormCompanyList
                  form={form}
                  isName="party_b_object"
                  isLabel="簽約對象"
                  cpList={partyBObjectIdList}
                  setCpList={setPartyBObjectIdList}
                  cpCodeList={partyBObjectIdCodeLabel}
                  setCpCodeList={setPartyBObjectIdCodeLabel}
                />
              </Col>
              <Col xs={24} lg={8}>
                <FormCompanyNameAPI
                  form={form}
                  isLabel="簽約單位"
                  isName="party_b_company_id"
                  isSelectText="party_b_company_text"
                  isList={partyBCompanyIdList}
                  setIsList={setPartyBCompanyIdList}
                  cpCodeLabel={partyBCompanyIdCodeLabel}
                  setCpCodeLabel={setPartyBCompanyIdCodeLabel}
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col xs={24} lg={8}>
                <FormCompanyNickNameAuthorName
                  form={form}
                  isLabel="OP"
                  changeToCompanyName={false}
                  isUiSelectVal={opSelectVal}
                  isSetUiSelectVal={setOpSelectVal}
                  isCpName="op_nickname_id"
                  isCpSelectText="op_nickname"
                  isCpList={opNicknameList}
                  setIsCpList={setOpNicknameList}
                  cpCodeLabel={opNicknameCodeLabel}
                  setCpCodeLabel={setOpNicknameCodeLabel}
                  isAtName="op_author_id"
                  isAtSelectText="op_author_name"
                  isAtList={opAuthorList}
                  setIsAtList={setOpAuthorList}
                  atCodeLabel={opAuthorCodeLabel}
                  setAtCodeLabel={setOpAuthorCodeLabel}
                  customAuthorOptLabel="作者"
                />
              </Col>
              <Col xs={24} lg={8}>
                <FormCompanyNicknameAPI
                  form={form}
                  isLabel="SP"
                  isName="sp_nickname_id"
                  isSelectText="sp"
                  isList={spCompanyList}
                  setIsList={setSpCompanyList}
                  cpCodeLabel={spCompanyCodeLabel}
                  setCpCodeLabel={setSpCompanyCodeLabel}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={8}>
                <FormContractGroup
                  isLabel="合約群組"
                  isEditContract={isEditContract}
                  contractGroup={contractGroup}
                  setContractGroup={setContractGroup}
                  contractGroupArr={contractGroupArr}
                  setContractGroupArr={setContractGroupArr}
                  showConfirm={showConfirm}
                />
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
          >
            <Row gutter={[64, 24]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label="合約開始日"
                  name="contract_start_date"
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="代理到期日"
                  name="contract_agency_end"
                  rules={[
                    { required: isPermanent === '0' && isTransfer === '0', message: '此欄位為必填' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || moment(getFieldValue('contract_end_date')) <= value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('代理到期日需大於或等於合約到期日'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    disabledDate={(current) => {
                      const contractEndDate = form.getFieldValue('contract_end_date');
                      const contractExpiryDate = form.getFieldValue('contract_expiry_date');
                      if (contractEndDate && contractExpiryDate) {
                        if (moment(contractEndDate) < moment(contractExpiryDate)) {
                          return current <= moment(contractEndDate).subtract(1, 'days').endOf('day');
                        }
                        return current <= moment(contractExpiryDate).subtract(1, 'days').endOf('day');
                      }
                      if (contractExpiryDate === null && contractEndDate) {
                        return current <= moment(contractEndDate).subtract(1, 'days').endOf('day');
                      }
                      return current <= moment(form.getFieldValue('contract_start_date')).endOf('day');
                    }}
                    style={{ width: '100%' }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label="合約提前終止"
                  name="is_termination"
                  initialValue="0">
                  <Radio.Group
                    options={optInsurance2}
                    onChange={(e) => {
                      setTerminationDate(e.target.value);
                    }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
                <Form.Item
                  name="contract_termination_date"
                  hidden={terminationDate === '0'}
                  rules={[
                    { required: terminationDate === '1', message: '此欄位為必填' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || moment(getFieldValue('contract_start_date')) < value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('提前終止日需大於合約開始日'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      return current && current < moment(form.getFieldValue('contract_start_date')).endOf('day');
                    }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="合約到期日"
                  name="contract_end_date"
                  rules={[
                    { required: isPermanent === '0' && isTransfer === '0', message: '此欄位為必填' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || moment(getFieldValue('contract_start_date')) < value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('合約到期日需大於合約開始日'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    disabledDate={(current) => {
                      return current && current < moment(form.getFieldValue('contract_start_date')).endOf('day');
                    }}
                    style={{ width: '100%' }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="延約同時展延代理到期日?"
                  name="agency_renew"
                  initialValue="0">
                  <Radio.Group
                    options={optInsurance}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="承上，是否提前終止代理到期日？"
                  name="is_early_terminate"
                  initialValue="0">
                  <Radio.Group
                    options={optInsurance}
                    onChange={(e) => {
                      setEarlyTerminationDate(e.target.value);
                    }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
                <Form.Item
                  name="early_terminate_date"
                  hidden={earlyTerminationDate === '0'}
                  rules={[
                    { required: earlyTerminationDate === '1', message: '此欄位為必填' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || moment(getFieldValue('contract_start_date')) < value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('代理提前終止日需大於合約開始日'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      return current && current < moment(form.getFieldValue('contract_start_date')).endOf('day');
                    }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="合約有效日"
                  name="contract_expiry_date"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || moment(getFieldValue('contract_end_date')) <= value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('合約有效日需大於等於合約到期日'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    format={dateFormat}
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      return current && current <= moment(form.getFieldValue('contract_end_date')).subtract(1, 'days').endOf('day');
                    }}
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="代理年限"
                  name="agency_year"
                >
                  <Input
                    style={{ width: '50%' }}
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="永久"
                  name="is_permanent"
                  initialValue={isPermanent}
                >
                  <Radio.Group
                    options={optInsurance}
                    onChange={e => setIsPermanent(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="續約年限"
                  name="renewal_period"
                >
                  <Input
                    style={{ width: '50%' }}
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={isPermanent === '1' || isTransfer === '1'}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label="轉讓"
                  name="is_transfer"
                  initialValue={isTransfer}>
                  <Radio.Group
                    options={optInsurance}
                    onChange={e => setIsTransfer(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <FormArea
                  form={form}
                  isLabel="授權地區"
                  isNameAreaRadioTypeRadio="authorized_area_type_radio"
                  isNameAreaIdInputCountrys="authorized_area_id_input_countrys"
                  isNameAreaId="authorized_area_id"
                  isNameAreaTypeSelect="authorized_area_type_select"
                  isNameAreaIdInput2Countrys="authorized_area_id_input2_countrys"
                  isInit={initAgencyArea}
                  setIsInit={setInitAgencyArea}
                  initAuthorizedAreaList={
                    (isEdit)
                      ? (initAgencyAreaList)
                      : ([])
                  }
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={agencyAreaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAgencyAreaCountry2Disabled}
                />
              </Col>
            </Row>
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <div className={styles.contentBBd} />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  label="備註"
                  name="notes"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <FormCommission
            form={form}
            optCurrency={optCurrency}
            countryList={authorizedCountryList.countryList}
          />
        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={() => showConfirm(isEdit ? 'edit' : 'add')}
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

export default connect(({ contractSongList, authorizedAreaList, authorizedCountryList, loading }) => ({
  contractSongList,
  authorizedCountryList,
  authorizedAreaList,
  loading: loading.models.contractSongList,
}))(Update);

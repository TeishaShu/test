import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Select,
  Checkbox,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  InputNumber,
  message,
  notification,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FormCompanyNameAPI from '@/components/FormCompanyNameAPI';
import FooterToolbar from '@/components/FooterToolbar';
import FormCompanyNickNameAuthorName from '@/components/FormCompanyNickNameAuthorName';
import FormArea from '@/components/FormArea';
import ComUpload from './components/ComUpload';
import FormCompanyList from './components/FormCompanyList';
import ComSplitInfoText from '../components/ComSplitInfoText';
import FormSplit from './components/FormSplit';
import FormContractGroup from './components/FormContractGroup';
import FormNextContractAPI from './components/FormNextContractAPI';
import valid from '@/fn/valid';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingMultiGetContractAuthorInfo,
    loadingExitContractGroup,
    loadingEditContractAuthorForm,
    loadingAddContractAuthorForm,
    dispatch,
    match,
    authorizedAreaList,
    authorizedCountryList,
    contractSongList,
    contractAuthorList: { multiChangeId, optType, info, updateDataResult, },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const dateFormat = 'YYYY-MM-DD';
  // upload
  const [tmpFileList, setTmpFileList] = useState([]);
  // next_contract
  const [nextContractList, setNextContractList] = useState([]);
  const [disabledNextContract, setDisabledNextContract] = useState(false);
  // party_a_company_id
  const [partyACompanyList, setPartyACompanyList] = useState([]);
  const [partyACompanyCodeLabel, setPartyACompanyCodeLabel] = useState('');
  // party_b_object_company_id, party_b_object_author_id
  const [partyBObjectAuthorSelectVal, setPartyBObjectAuthorSelectVal] = useState('2');
  const [partyBObjectCompanyList, setPartyBObjectCompanyList] = useState([]);
  const [partyBObjectCompanyCodeLabel, setPartyBObjectCompanyCodeLabel] = useState('');
  const [partyBObjectAuthorList, setPartyBObjectAuthorList] = useState([]);
  const [partyBObjectAuthorCodeLabel, setPartyBObjectAuthorCodeLabel] = useState('');
  // party_b_company_id
  const [partyBCompanyList, setPartyBCompanyList] = useState([]);
  const [partyBCompanyCodeLabel, setPartyBCompanyCodeLabel] = useState('');
  // contract_termination_date
  const [disabledContractTerminationDate, setDisabledContractTerminationDate] = useState(false);
  const [showContractTerminationDate, setShowContractTerminationDate] = useState(false);
  // contract_end_date
  const [disabledContractEndDate, setDisabledContractEndDate] = useState(false);
  // contract_expiry_date
  const [disabledContractExpiryDate, setDisabledContractExpiryDate] = useState(false);
  // renewal_period
  const [disabledRenewalPeriod, setDisabledRenewalPeriod] = useState(false);
  // rights_end_date
  const [disabledRightsEndDate, setDisabledRightsEndDate] = useState(false);
  // rights_termination_date_radio
  const [disabledRightsTerminationDateRadio, setDisabledRightsTerminationDateRadio] = useState(false);
  // rights_termination_date
  const [showRightsTerminationDate, setShowRightsTerminationDate] = useState(false);
  // is_permanent
  const [disabledIsPermanent, setDisabledIsPermanent] = useState(false);
  // contract_group
  const [contractGroup, setContractGroup] = useState('');
  // authorized_area_type_radio, authorized_area_id_input_countrys, authorized_area_id, authorized_area_type_select, authorized_area_id_input2_countrys
  const [initAuthorizedArea, setInitAuthorizedArea] = useState(true);
  const [initAuthorizedAreaList, setInitAuthorizedAreaList] = useState([]);
  const [authorizedAreaCountry2Disabled, setAuthorizedAreaCountry2Disabled] = useState(false);
  // media_owners_1
  const [mediaOwners1List, setMediaOwners1List] = useState([]);
  const [mediaOwners1CodeList, setMediaOwners1CodeList] = useState([]);
  // media_owners_2
  const [mediaOwners2List, setMediaOwners2List] = useState([]);
  const [mediaOwners2CodeList, setMediaOwners2CodeList] = useState([]);
  // media_owners_3
  const [mediaOwners3List, setMediaOwners3List] = useState([]);
  const [mediaOwners3CodeList, setMediaOwners3CodeList] = useState([]);

  // api -----
  // getData
  const getData = (edit) => {
    dispatch({
      type: 'contractAuthorList/fetchMultiGetContractAuthorInfo',
      payload: {
        isEdit: edit,
        contract_author_id: match.params.id,
      }
    });
  }

  // mount
  useEffect(() => {
    let initObj = {  // all for ui
      contract_author_types: [],
      contract_code: '',
      next_contract_id: '',  // 接續合約
      next_contract_code: '',
      party_a_company_id: '',
      party_a_company_name: '',
      party_b_company_id: '',
      party_b_object_author_id: '',
      party_b_object_author_name: '',
      party_b_object_company_id: '',
      party_b_object_company_name: '',
      contract_group: [],
      contract_signing_date: '',  // 簽約日期
      contract_start_date: '',
      contract_end_date: '',
      contract_expiry_date: '',
      rights_termination_date_radio: '0',
      rights_termination_date: '',
      contract_termination_date_radio: '0',
      contract_termination_date: '',
      rights_end_date: '',
      renewal_period: '',
      published_album_quantity: '',
      is_permanent: '0',
      is_buyout: '0',
      notes: '',
      currency_id: '1',
      master_tape_owners: [],
      media_owners: [],
      article_owners: [],
      contract_group_radio: '',
      contract_group_1: [],  // 增加群組
      contract_group_2: '',  // 加入群組
      contract_group_3: '', // 退出群組
      authorized_area_type_radio: '0',
      authorized_area_id_input_countrys: [],
      authorized_area_type_select: '2',
      authorized_area_id_input2_countrys: [],
      media_owners_1: [{ company_nickname_id: '', }],
      media_owners_2: [{ company_nickname_id: '', }],
      media_owners_3: [{ company_nickname_id: '', }],
      split_1: [  // CD
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_2: [  // DVD
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_3: [  // 卡帶
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_4: [  // 黑膠
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_5: [  // Vocal
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_6: [  // Video
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_7: [  // 營業用單曲
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_8: [  // 明星商品
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_9: [  // 書籍
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_10: [  // 電子書
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_11: [  // 其他
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
      split_12: [  // 特殊
        { country_id: '229', value: '' },
        { country_id: '0', value: '' },
        { country_id: '', value: '' },
      ],
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
      getData();
    }
  }, [match.params.id]);

  // updateDate
  useEffect(() => {
    // for edit
    if (match.params.id) {
      // 附件
      let filesList = [];
      if (info.files && info.files.length > 0) {
        for (let i = 0; i < info.files.length; i++) {
          let fileItem = {};

          if (info.files[i].orig_name && info.files[i].id) {
            fileItem.uid = i;
            fileItem.name = `${info.files[i].orig_name}.${info.files[i].ext}`;
            fileItem.status = 'old';
            fileItem.url = `${window.FRONTEND_WEB}/Contract_author/download_file`;
            fileItem.fileId = info.files[i].id;
            fileItem.name = `${info.files[i].orig_name}.${info.files[i].ext}`;

            filesList.push(fileItem);
          }
        }
        setTmpFileList(filesList);
      } else {
        setTmpFileList([]);
      }

      // 型態
      let tmpAuthorType = [];
      if (info.contract_author_types) {
        info.contract_author_types.forEach((elem) => {
          tmpAuthorType.push(elem.type);
        });
      }
      form.setFieldsValue({ contract_author_types: tmpAuthorType });

      // 合約編號
      form.setFieldsValue({ contract_code: info.basic_info.contract_code });

      // 簽約日期
      form.setFieldsValue({
        contract_signing_date: (typeof (info.basic_info.contract_signing_date) == 'string') ? (info.basic_info.contract_signing_date != '' ? moment(info.basic_info.contract_signing_date) : null) : info.basic_info.contract_signing_date
      });

      // 接續合約
      if (info.basic_info.next_contract && info.basic_info.next_contract.id) {
        form.setFieldsValue({ next_contract_id: info.basic_info.next_contract.id });
        form.setFieldsValue({ next_contract_code: info.basic_info.next_contract.contract_code });
        setNextContractList([{ id: info.basic_info.next_contract.id, contract_code: info.basic_info.next_contract.contract_code }]);
      } else {
        form.setFieldsValue({ next_contract_id: '' });
        form.setFieldsValue({ next_contract_code: '' });
        setNextContractList([]);
      }


      // 我方簽約單位
      if (info.basic_info.party_a_company) {
        setPartyACompanyList([info.basic_info.party_a_company]);
        setPartyACompanyCodeLabel(info.basic_info.party_a_company.company_code);
        form.setFieldsValue({ party_a_company_id: info.basic_info.party_a_company.id });
        form.setFieldsValue({ party_a_company_name: info.basic_info.party_a_company.name });
      } else {
        setPartyACompanyList([]);
        setPartyACompanyCodeLabel('');
      }

      // 簽約對象 - 藝人, 簽約對象 - 公司
      if (info.basic_info.party_b_object_company) {
        setPartyBObjectAuthorSelectVal('1');
        setPartyBObjectCompanyList([info.basic_info.party_b_object_company]);
        setPartyBObjectCompanyCodeLabel(info.basic_info.party_b_object_company.company_code);
        setPartyBObjectAuthorList([]);
        setPartyBObjectAuthorCodeLabel('');
        form.setFieldsValue({ party_b_object_company_id: info.basic_info.party_b_object_company.id });
        form.setFieldsValue({ party_b_object_company_name: info.basic_info.party_b_object_company.name });
      } else if (info.basic_info.party_b_object_author) {
        setPartyBObjectAuthorSelectVal('2');
        setPartyBObjectCompanyList([]);
        setPartyBObjectCompanyCodeLabel('');
        setPartyBObjectAuthorList([info.basic_info.party_b_object_author]);
        setPartyBObjectAuthorCodeLabel(info.basic_info.party_b_object_author.author_code);
        form.setFieldsValue({ party_b_object_author_id: info.basic_info.party_b_object_author.id });
        form.setFieldsValue({ party_b_object_author_name: info.basic_info.party_b_object_author.name });
      } else {
        setPartyBObjectAuthorSelectVal('1');
        setPartyBObjectCompanyList([]);
        setPartyBObjectCompanyCodeLabel('');
        setPartyBObjectAuthorList([]);
        setPartyBObjectAuthorCodeLabel('');
      }

      // 簽約單位
      if (info.basic_info.party_b_company) {
        setPartyBCompanyList([info.basic_info.party_b_company]);
        setPartyBCompanyCodeLabel(info.basic_info.party_b_company.company_code);
        form.setFieldsValue({ party_b_company_id: info.basic_info.party_b_company.id });
        form.setFieldsValue({ party_b_company_name: info.basic_info.party_b_company.name });
      } else {
        setPartyBCompanyList([]);
        setPartyBCompanyCodeLabel('');
      }

      // 合約群組
      if (info.basic_info.contract_group_name) {
        setContractGroup('3');
        form.setFieldsValue({ contract_group_3: info.basic_info.contract_group_name });
      } else {
        setContractGroup('');
      }
      form.setFieldsValue({ contract_group_radio: '' });

      // 合約開始日
      form.setFieldsValue({
        contract_start_date: (typeof (info.basic_info.contract_start_date) == 'string') ? (info.basic_info.contract_start_date != '' ? moment(info.basic_info.contract_start_date) : null) : info.basic_info.contract_start_date
      });

      // 續約年限
      form.setFieldsValue({ renewal_period: info.basic_info.renewal_period });

      // 合約提前終止
      form.setFieldsValue({
        contract_termination_date: (typeof (info.basic_info.contract_termination_date) == 'string') ? (info.basic_info.contract_termination_date != '' ? moment(info.basic_info.contract_termination_date) : null) : info.basic_info.contract_termination_date
      });
      form.setFieldsValue({ contract_termination_date_radio: (info.basic_info.contract_termination_date) ? '1' : '0' });

      // 合約到期日
      form.setFieldsValue({
        contract_end_date: (typeof (info.basic_info.contract_end_date) == 'string') ? (info.basic_info.contract_end_date != '' ? moment(info.basic_info.contract_end_date) : null) : info.basic_info.contract_end_date
      });

      // 代理/發行到期日
      form.setFieldsValue({
        rights_end_date: (typeof (info.basic_info.rights_end_date) == 'string') ? (info.basic_info.rights_end_date != '' ? moment(info.basic_info.rights_end_date) : null) : info.basic_info.rights_end_date
      });

      // 承上，是否提前終止代理到期日？
      form.setFieldsValue({
        rights_termination_date: (typeof (info.basic_info.rights_termination_date) == 'string') ? (info.basic_info.rights_termination_date != '' ? moment(info.basic_info.rights_termination_date) : null) : info.basic_info.rights_termination_date
      });
      form.setFieldsValue({ rights_termination_date_radio: (info.basic_info.rights_termination_date) ? '1' : '0' });

      // 合約有效日
      form.setFieldsValue({
        contract_expiry_date: (typeof (info.basic_info.contract_expiry_date) == 'string') ? (info.basic_info.contract_expiry_date != '' ? moment(info.basic_info.contract_expiry_date) : null) : info.basic_info.contract_expiry_date
      });

      // 永久
      form.setFieldsValue({ is_permanent: (info.basic_info.is_permanent) ? (info.basic_info.is_permanent) : '0' });

      // 授權地區
      if (info.basic_info.authorized_area_type == '1') {
        form.setFieldsValue({ authorized_area_type_radio: '1' });
        form.setFieldsValue({ authorized_area_type_select: '2' });
      } else {
        form.setFieldsValue({ authorized_area_type_radio: '0' });
        form.setFieldsValue({ authorized_area_type_select: (info.basic_info.authorized_area_type) ? (info.basic_info.authorized_area_type) : '2' });
      }
      setAuthorizedAreaCountry2Disabled(info.basic_info.authorized_area_type == '2' ? true : false);

      // for authorized_area_id init option (only for ui)
      setInitAuthorizedArea(true);
      if (info.basic_info.authorized_area && info.basic_info.authorized_area.id && info.basic_info.authorized_area.area_name) {
        setInitAuthorizedAreaList([{ id: info.basic_info.authorized_area.id, area_name: info.basic_info.authorized_area.area_name }]);
        form.setFieldsValue({ authorized_area_id: info.basic_info.authorized_area.id });
      } else {
        setInitAuthorizedAreaList([]);
        form.setFieldsValue({ authorized_area_id: '' });
      }

      // authorized_countries
      let tempCountrysArr = [];
      if (info.basic_info.authorized_area_type && info.basic_info.authorized_area_type != '2' && info.authorized_countries && info.authorized_countries.length > 0) {
        for (let i = 0; i < info.authorized_countries.length; i++) {
          tempCountrysArr.push(info.authorized_countries[i].country.id);
        }
        if (info.basic_info.authorized_area_type == '1') {
          form.setFieldsValue({ authorized_area_id_input_countrys: tempCountrysArr });
          form.setFieldsValue({ authorized_area_id_input2_countrys: [] });
        } else {
          form.setFieldsValue({ authorized_area_id_input_countrys: [] });
          form.setFieldsValue({ authorized_area_id_input2_countrys: tempCountrysArr });
        }
      } else {
        form.setFieldsValue({ authorized_area_id_input_countrys: [] });
        form.setFieldsValue({ authorized_area_id_input2_countrys: [] });
      }

      // 專輯發行數量
      form.setFieldsValue({ published_album_quantity: (info.basic_info.published_album_quantity) ? (info.basic_info.published_album_quantity) : '' });

      // 買斷
      form.setFieldsValue({ is_buyout: (info.basic_info.is_buyout) ? (info.basic_info.is_buyout) : '' });

      // 母帶權利人、視聽著作權人、語文著作權人
      let tmpMediaOwners1 = [];
      let tmpMediaOwners2 = [];
      let tmpMediaOwners3 = [];
      let tmpMediaOwners1List = [];
      let tmpMediaOwners2List = [];
      let tmpMediaOwners3List = [];
      let tmpMediaOwners1Code = [];
      let tmpMediaOwners2Code = [];
      let tmpMediaOwners3Code = [];
      if (info.media_owners && info.media_owners.length > 0) {
        for (let i = 0; i < info.media_owners.length; i++) {
          let itemVal = { id: info.media_owners[i].id, company_nickname_id: info.media_owners[i].company_nickname.id };
          let item = {
            id: info.media_owners[i].company_nickname.id,
            // id: info.media_owners[i].id,
            // company_nickname_id: info.media_owners[i].company_nickname.id,
            nickname: info.media_owners[i].company_nickname.nickname,
            company_code: info.media_owners[i].company_nickname.company_code
          };
          let itemCode = (info.media_owners[i].company_nickname.company_code) ? (info.media_owners[i].company_nickname.company_code) : ('');
          if (info.media_owners[i].type == '1') {
            tmpMediaOwners1.push(itemVal);
            tmpMediaOwners1List.push([item]);
            tmpMediaOwners1Code.push(itemCode);
          } else if (info.media_owners[i].type == '2') {
            tmpMediaOwners2.push(itemVal);
            tmpMediaOwners2List.push([item]);
            tmpMediaOwners2Code.push(itemCode);
          } else if (info.media_owners[i].type == '3') {
            tmpMediaOwners3.push(itemVal);
            tmpMediaOwners3List.push([item]);
            tmpMediaOwners3Code.push(itemCode);
          }
        }
      }
      if (tmpMediaOwners1List.length == 0) {
        setMediaOwners1List([]);
        setMediaOwners1CodeList([]);
        form.setFieldsValue({ media_owners_1: [{ company_nickname_id: '', }] });
      } else {
        setMediaOwners1List(tmpMediaOwners1List);
        setMediaOwners1CodeList(tmpMediaOwners1Code);
        form.setFieldsValue({ media_owners_1: tmpMediaOwners1 });
      }
      if (tmpMediaOwners2List.length == 0) {
        setMediaOwners2List([]);
        setMediaOwners2CodeList([]);
        form.setFieldsValue({ media_owners_2: [{ company_nickname_id: '', }] });
      } else {
        setMediaOwners2List(tmpMediaOwners2List);
        setMediaOwners2CodeList(tmpMediaOwners2Code);
        form.setFieldsValue({ media_owners_2: tmpMediaOwners2 });
      }
      if (tmpMediaOwners3.length == 0) {
        setMediaOwners3List([]);
        setMediaOwners3CodeList([]);
        form.setFieldsValue({ media_owners_3: [{ company_nickname_id: '', }] });
      } else {
        setMediaOwners3List(tmpMediaOwners3List);
        setMediaOwners3CodeList(tmpMediaOwners3Code);
        form.setFieldsValue({ media_owners_3: tmpMediaOwners3 });
      }

      // 備註
      form.setFieldsValue({ notes: (info.basic_info.notes) ? (info.basic_info.notes) : '' });

      // 幣別
      form.setFieldsValue({ currency_id: (info.basic_info.currency_id) ? (info.basic_info.currency_id) : '' });

      // 拆分
      const tmpSplit = {
        split_1: [  // CD
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_2: [  // DVD
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_3: [  // 卡帶
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_4: [  // 黑膠
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_5: [  // Vocal
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_6: [  // Video
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_7: [  // 營業用單曲
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_8: [  // 明星商品
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_9: [  // 書籍
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_10: [  // 電子書
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_11: [  // 其他
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
        split_12: [  // 特殊
          { country_id: '229', value: '' },
          { country_id: '0', value: '' },
          { country_id: '', value: '' },
        ],
      };
      const convertSplitType = (getDataType) => {
        let returnVal = '';
        switch (getDataType) {
          case '1':
            returnVal = '';
            break;
          case '2':
            returnVal = '%';
            break;
          case '3':
            returnVal = '#';
            break;
          case '4':
            returnVal = 'Q';
            break;
          case '5':
            returnVal = '*';
            break;
          case '6':
            returnVal = '^';
            break;
          default:
            returnVal = '';
        }

        return returnVal;
      }

      if (info.split_information && info.split_information.length > 0) {
        for (let i = 0; i < info.split_information.length; i++) {
          let item = info.split_information[i];
          let itemId = item['contract_author_split_item_id'];

          if (item.country && item.country.id == '229') {
            tmpSplit['split_' + itemId][0]['id'] = item.id;
            tmpSplit['split_' + itemId][0]['value'] = item.split_value + convertSplitType(item.split_value_type);
          } else if (item.is_specified_country == '0') {
            tmpSplit['split_' + itemId][1]['id'] = item.id;
            tmpSplit['split_' + itemId][1]['value'] = item.split_value + convertSplitType(item.split_value_type);
          } else if (item.country) {
            tmpSplit['split_' + itemId].push({
              id: item.id,
              country_id: item.country.id,
              value: item.split_value + convertSplitType(item.split_value_type)
            });
          }
        }
      }
      for (let i = 1; i <= 12; i++) {
        if (tmpSplit['split_' + i.toString()].length > 3) {
          tmpSplit['split_' + i.toString()].splice(2, 1);
        }
        form.setFieldsValue({ ['split_' + i.toString()]: tmpSplit['split_' + i.toString()] });
      }
    }

    // trigger change
    changeFormItem('contract_end_date');
    changeFormItem('contract_termination_date_radio');
    changeFormItem('rights_termination_date_radio');
    changeFormItem('contract_expiry_date');
    changeFormItem('is_permanent');
    changeFormItem('is_buyout');
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let formObj = Object.assign({}, values);
    let saveObj = {
      contract_author_types: {  // 型態
        new_contract_author_types: [],
        delete_ids: [],
      },
      contract_code: null,  // 合約編號
      contract_signing_date: null,  // 簽約日期
      next_contract_id: null,  // 接續合約
      party_a_company_id: null,  // 我方簽約單位
      party_b_object_author_id: null,  // 簽約對象 - 藝人
      party_b_object_company_id: null,  // 簽約對象 - 公司
      party_b_company_id: null,  // 簽約單位
      contract_group: {  // 合約群組
        new_contract_group: [],  // 新增合約群組
        join_contract_group: null,  // 加入合約群組
      },
      contract_start_date: null,  // 合約開始日
      renewal_period: null,  // 續約年限
      contract_termination_date: null,  // 合約終止日
      contract_end_date: null,  // 合約到期日
      rights_end_date: null,  // 代理/發行到期日
      rights_termination_date: null,  // 承上，是否提前終止代理到期日？
      contract_expiry_date: null,  // 合約有效日
      is_permanent: null,  // 永久
      authorized_area_type: '1',  // 授權地區
      authorized_area_id: null,
      authorized_countries: {
        new_countries: [],
        delete_ids: []
      },
      published_album_quantity: null,  // 專輯發行數量
      is_buyout: null,  // 買斷
      contract_author_media_owners: {  // 母帶權利人、視聽著作權人、語文著作權人
        new_owners: [],
        delete_ids: []
      },
      notes: null,  // 備註
      currency_id: null,  // 幣別
      split_information: {  // 拆分
        new_split_information: [],
        update_split_information: [],
        delete_ids: [],
      }
    };

    // contract_author_id
    if (isEdit) {
      saveObj.contract_author_id = match.params.id;
    }

    // 型態
    let orgContractAuthorType = (info.contract_author_types) ? (info.contract_author_types.slice()) : [];
    let tmpContractAuthorType = formObj.contract_author_types;
    if (isEdit) {
      for (let i = 0; i < tmpContractAuthorType.length; i++) {
        let findItem = false;
        for (let j = 0; j < orgContractAuthorType.length; j++) {
          if (tmpContractAuthorType[i] == orgContractAuthorType[j].type) {
            findItem = true;

            orgContractAuthorType.splice(j, 1);
            break;
          }
        }

        // new_contract_author_types
        if (!findItem) {
          saveObj.contract_author_types.new_contract_author_types.push(tmpContractAuthorType[i]);
        }
      }

      // delete_ids
      for (let k = 0; k < orgContractAuthorType.length; k++) {
        saveObj.contract_author_types.delete_ids.push(orgContractAuthorType[k].id);
      }
    } else {
      saveObj.contract_author_types.new_contract_author_types = formObj.contract_author_types.slice();
    }

    // 合約編號
    if (formObj.contract_code) {
      saveObj.contract_code = formObj.contract_code;
    }

    // 簽約日期
    if (formObj.contract_signing_date && typeof (formObj.contract_signing_date) == 'object') {
      saveObj.contract_signing_date = form.getFieldValue()['contract_signing_date'].format(dateFormat);
    }

    // 接續合約
    if (formObj.next_contract_id) {
      saveObj.next_contract_id = formObj.next_contract_id;
    }

    // 我方簽約單位
    if (formObj.party_a_company_id) {
      saveObj.party_a_company_id = formObj.party_a_company_id;
    }

    // 簽約對象 - 藝人
    if (partyBObjectAuthorSelectVal == '2' && formObj.party_b_object_author_id) {
      saveObj.party_b_object_author_id = formObj.party_b_object_author_id;
    }

    // 簽約對象 - 公司
    if (partyBObjectAuthorSelectVal == '1' && formObj.party_b_object_company_id) {
      saveObj.party_b_object_company_id = formObj.party_b_object_company_id;
    }

    // 簽約單位
    if (formObj.party_b_company_id) {
      saveObj.party_b_company_id = formObj.party_b_company_id;
    }

    // 合約群組
    if (contractGroup == '1') {
      saveObj.contract_group.new_contract_group = (formObj.contract_group_1) ? (formObj.contract_group_1.slice()) : [];
    } else if (contractGroup == '2') {
      saveObj.contract_group.join_contract_group = (formObj.contract_group_2) ? (formObj.contract_group_2) : null;
    }

    // 合約開始日
    if (formObj.contract_start_date && typeof (formObj.contract_start_date) == 'object') {
      saveObj.contract_start_date = form.getFieldValue()['contract_start_date'].format(dateFormat);
    }

    // 續約年限
    if (formObj.renewal_period) {
      saveObj.renewal_period = formObj.renewal_period;
    }

    // 合約提前終止
    if (formObj.contract_termination_date_radio == '1' && formObj.contract_termination_date && typeof (formObj.contract_termination_date) == 'object') {
      saveObj.contract_termination_date = form.getFieldValue()['contract_termination_date'].format(dateFormat);
    }

    // 合約到期日
    if (formObj.contract_end_date && typeof (formObj.contract_end_date) == 'object') {
      saveObj.contract_end_date = form.getFieldValue()['contract_end_date'].format(dateFormat);
    }

    // 代理/發行到期日
    if (formObj.rights_end_date && typeof (formObj.rights_end_date) == 'object') {
      saveObj.rights_end_date = form.getFieldValue()['rights_end_date'].format(dateFormat);
    }

    // 承上，是否提前終止代理到期日？
    if (formObj.rights_termination_date_radio == '1' && formObj.rights_termination_date && typeof (formObj.rights_termination_date) == 'object') {
      saveObj.rights_termination_date = form.getFieldValue()['rights_termination_date'].format(dateFormat);
    }

    // 合約有效日
    if (formObj.contract_expiry_date && typeof (formObj.contract_expiry_date) == 'object') {
      saveObj.contract_expiry_date = form.getFieldValue()['contract_expiry_date'].format(dateFormat);
    }

    // 永久
    if (formObj.is_permanent) {
      saveObj.is_permanent = formObj.is_permanent;
    }

    // 授權地區
    if (formObj.authorized_area_type_radio == '1') {
      saveObj.authorized_area_type = '1';
      saveObj.authorized_area_id = null;
    } else {
      saveObj.authorized_area_type = formObj.authorized_area_type_select;
      saveObj.authorized_area_id = (formObj.authorized_area_id) ? (formObj.authorized_area_id) : null;
    }

    let OrgCountryList = info.authorized_countries ? info.authorized_countries.slice() : [];
    let tempCountryList = [];

    if (saveObj.authorized_area_type == '1') {
      tempCountryList = formObj.authorized_area_id_input_countrys;
    } else if (saveObj.authorized_area_type != '2') {
      tempCountryList = formObj.authorized_area_id_input2_countrys;
    }

    if (isEdit) {
      for (let i = 0; i < tempCountryList.length; i++) {
        let findItem = false;
        for (let j = 0; j < OrgCountryList.length; j++) {
          if (tempCountryList[i] == OrgCountryList[j].country.id) {
            findItem = true;
            OrgCountryList.splice(j, 1);
            break;
          }
        }

        // new_countries
        if (!findItem) {
          saveObj.authorized_countries.new_countries.push(tempCountryList[i]);
        }
      }

      // delete_id
      for (let k = 0; k < OrgCountryList.length; k++) {
        saveObj.authorized_countries.delete_ids.push(OrgCountryList[k].id);
      }
    } else {
      saveObj.authorized_countries.new_countries = tempCountryList.slice();
    }

    // 專輯發行數量
    if (formObj.published_album_quantity) {
      saveObj.published_album_quantity = formObj.published_album_quantity;
    }

    // 買斷
    saveObj.is_buyout = formObj.is_buyout;

    // 母帶權利人、視聽著作權人、語文著作權人
    const convertMediaOwners = (items, type) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id && (items[i].is_delete == '1' || items[i].is_edit == '1')) {
          saveObj.contract_author_media_owners.delete_ids.push(items[i].id);
        }

        // add push
        if (items[i].is_edit == '1' && items[i].company_nickname_id) {
          saveObj.contract_author_media_owners.new_owners.push({ type: type, company_nickname_id: items[i].company_nickname_id });
        }
      }
    }
    for (let j = 0; j < 3; j++) {
      let num = j + 1;
      num = num.toString();
      convertMediaOwners(formObj['media_owners_' + num], num);
    }

    // 備註
    if (formObj.notes) {
      saveObj.notes = formObj.notes;
    }

    // 幣別
    saveObj.currency_id = formObj.currency_id;

    // 拆分 NOT FINISH
    let splitReg = /^[%#Q*^]{1}$/;
    const convertMark = (mark) => {
      let orgMark = splitReg.test(mark) ? mark : null;
      let newVal = '1';

      switch (orgMark) {
        case '%':
          newVal = '2';
          break;
        case '#':
          newVal = '3';
          break;
        case 'Q':
          newVal = '4';
          break;
        case '*':
          newVal = '5';
          break;
        case '^':
          newVal = '6';
          break;
        default:
          newVal = '1';
      }

      return newVal;
    }
    const convertSplit = (items, splitItemId) => {
      for (let i = 0; i < items.length; i++) {
        const obj = {};

        if ((items[i].id && items[i].is_delete == '1') || (items[i].id && (!items[i].country_id || !items[i].value))) {
          saveObj.split_information.delete_ids.push(items[i].id);
        } else if (items[i].country_id && items[i].value && items[i].is_delete != '1') {
          if (items[i].id) {
            obj.id = items[i].id;
          }
          obj.contract_author_split_item_id = splitItemId;
          obj.is_specified_country = (items[i].country_id == '0') ? '0' : '1';
          obj.country_id = (items[i].country_id == '0') ? null : items[i].country_id;
          obj.split_value_type = convertMark(items[i].value[items[i].value.length - 1]);
          obj.split_value = items[i].value.replace('%', '').replace('#', '').replace('Q', '').replace('*', '').replace('^', '');
          if (items[i].id) {
            saveObj.split_information.update_split_information.push(obj);
          } else {
            saveObj.split_information.new_split_information.push(obj);
          }
        }
      }
    }
    // split_1 - 12
    for (let j = 0; j < 12; j++) {
      let num = j + 1;
      num = num.toString();
      convertSplit(formObj['split_' + num], num);
    }

    // save api ---
    const saveFiles = (contractId) => {
      tmpFileList.filter((fElem) => fElem.newFile).forEach((elem) => {
        fetch(`${window.FRONTEND_WEB}/contract_author/save_file`, {
          method: 'put',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            contract_author_id: contractId,
            tmp_file_name: elem.name
          })
        }).then(res => {
          if (res.status != 200 && res.status != 201) {
            errHandler(`"${elem.name}" 檔案儲存失敗`);
          }
        }).catch(error => {
          errHandler(`"${elem.name}" 檔案儲存失敗`);
        });
      });
    }

    dispatch({
      type: (isEdit) ? 'contractAuthorList/fetchEditContractAuthorForm' : 'contractAuthorList/fetchAddContractAuthorForm',
      payload: saveObj,
      callback: res => {
        let redirect = '';

        if (res && res != 'error') {
          if (isEdit) {
            saveFiles(match.params.id);
            redirect = `/contract/contract_author/adv/${match.params.id}`;
          } else {
            saveFiles(res);
            redirect = `/contract/contract_author/adv/${res}`;
          }

          history.push(redirect);
        }
      }
    });
  }

  // showConfirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        let redirect = '';

        if (isEdit) {
          redirect = `/contract/contract_author/adv/${match.params.id}`;
        } else {
          redirect = `/contract/contract_author`;
        }

        history.push(redirect);
      },
      onCancel() { },
    });
  }

  // showConfirmExitContractGroup
  const showConfirmExitContractGroup = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要退出群組嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'contractAuthorList/fetchExitContractGroup',
          payload: {
            contract_author_id: match.params.id,
            contract_code: info.basic_info.contract_code,
            contract_group_name: info.basic_info.contract_group_name,
          },
          callback: res => {
            if (res && res != 'error') {
              setContractGroup('');
            }
          }
        });
      },
      onCancel() { },
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    contract_author_types: '型態',
    contract_code: '合約編號',
    next_contract_id: '接續合約',
    contract_start_date: '合約開始日',
    contract_termination_date_radio: '合約提前終止',
    contract_termination_date: '合約提前終止',
    contract_end_date: '合約到期日',
    rights_end_date: '代理/發行到期日',
    rights_termination_date_radio: '承上，是否提前終止代理到期日？',
    rights_termination_date: '前終止代理到期日',
    contract_expiry_date: '合約有效日',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['contract_author_types'];
    const cusFieldId = 'contract_author_types';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey === cusFieldId) {
        labelNode = document.getElementById(cusFieldId);
      } else if (fieldKey.indexOf('split_') >= 0) {
        labelNode = document.getElementById(fieldKey);
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
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }

        renderSelector = err.name[0];
        renderFieldName = '拆分';
      } else {
        if (!renderFieldName) {
          for (let i = 0; i < cusFields.length; i++) {
            if (key.indexOf(cusFields[i]) >= 0) {
              renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
              break;
            }
          }

          renderSelector = cusFieldId;
        }
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
    // console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  // ui -----
  // changeFormItem
  const changeFormItem = elem => {
    /*
     * 合約到期日, 合約有效日 (自動帶入)
     * if(兩者皆有值(合約到期日, 合約有效日) && 合約有效日 - 合約到期日 < 0) {
        合約到期日 = 合約有效日;
     * }
    */
    if (elem == 'contract_end_date' || elem == 'contract_expiry_date') {
      if (
        form.getFieldValue()['contract_end_date'] && typeof (form.getFieldValue()['contract_end_date']) == 'object' && form.getFieldValue()['contract_expiry_date'] && typeof (form.getFieldValue()['contract_expiry_date']) == 'object' && new Date(form.getFieldValue()['contract_expiry_date'].format(dateFormat)) - new Date(form.getFieldValue()['contract_end_date'].format(dateFormat)) < 0) {
        form.setFieldsValue({ contract_end_date: moment(form.getFieldValue()['contract_expiry_date'].format(dateFormat)) });
      }
    }

    /*
     * if(elem == '合約提前終止 radio') {
     *  if('合約提前終止 radio' == 0) {
     *    合約提前終止 = ''
     *    隱藏 '合約提前終止'
     *  } else {
     *    顯示 '合約提前終止'
     *  }
     * }
     * 
    */
    if (elem == 'contract_termination_date_radio') {
      if (form.getFieldValue()['contract_termination_date_radio'] == '0') {
        form.setFieldsValue({ contract_termination_date: null });
        setShowContractTerminationDate(false);
      } else {
        setShowContractTerminationDate(true);
      }
    }

    /*
     * if(elem == '承上，是否提前終止代理到期日？') {
     *  if(!承上，是否提前終止代理到期日？) {
     *    代理到期日提前終止 = ''
     *    隱藏 '代理到期日提前終止'
     *  } else {
     *    顯示 '代理到期日提前終止'
     *  }
     * }
     * 
    */
    if (elem == 'rights_termination_date_radio') {
      if (form.getFieldValue()['rights_termination_date_radio'] == '0') {
        form.setFieldsValue({ rights_termination_date: null });
        setShowRightsTerminationDate(false);
      } else {
        setShowRightsTerminationDate(true);
      }
    }

    /*
     * if(elem == '買斷') {
     *   if('買斷') {
     *     永久 == '是' 且 disabled 且 triggerchange
     *   } else {
     *     永久 enabled
     *   }
     * }
    */
    if (elem == 'is_buyout') {
      if (form.getFieldValue()['is_buyout'] == '1') {
        form.setFieldsValue({ is_permanent: '1' });
        setDisabledIsPermanent(true);
      } else {
        setDisabledIsPermanent(false);
      }
    }

    /*
     * if(elem == '永久'　|| elem == '買斷') {
     *   if('永久' || '買斷') {
     *     合約提前終止 = '' 且 disabled
     *     承上，是否提前終止代理到期日？ 為否且 disabled
     *     代理到期日提前終止 = '' 且隱藏
     *     接續合約 = '' 且 disabled
     *     合約到期日 disabled
     *     合約有效日 disabled
     *     續約年限 disabled
     *     代理/發行到期日 disabled
     *   } else if(!永久 && !買斷) {
     *     合約提前終止 enabled
     *     承上，是否提前終止代理到期日？ enabled
     *     接續合約 enabled
     *     合約到期日 enabled
     *     合約有效日 enabled
     *     續約年限 enabled
     *     代理/發行到期日 enabled
     *   }
     * }
    */
    if (elem == 'is_permanent' || elem == 'is_buyout') {
      if (form.getFieldValue()['is_permanent'] == '1' || form.getFieldValue()['is_buyout'] == '1') {
        setDisabledContractTerminationDate(true);
        setDisabledRightsTerminationDateRadio(true);
        form.setFieldsValue({ next_contract_id: '' });
        setDisabledNextContract(true);
        setDisabledContractEndDate(true);
        setDisabledContractExpiryDate(true);
        setDisabledRenewalPeriod(true);
        setDisabledRightsEndDate(true);
      } else {
        setDisabledContractTerminationDate(false);
        setDisabledRightsTerminationDateRadio(false);
        setDisabledNextContract(false);
        setDisabledContractEndDate(false);
        setDisabledContractExpiryDate(false);
        setDisabledRenewalPeriod(false);
        setDisabledRightsEndDate(false);
      }
    }
  }

  // checkDateRequired (valid for ui)
  const checkDateRequired = (dateVal) => {
    if (dateVal && typeof (dateVal) == 'object') {
      return true;
    }

    return false;
  }

  // errHandler
  const errHandler = (msg) => {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      message: msg,
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={isEdit ? (loadingExitContractGroup || loadingEditContractAuthorForm || loadingMultiGetContractAuthorInfo) : (loadingAddContractAuthorForm || loadingMultiGetContractAuthorInfo)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      // onFieldsChange={changeSongInfo}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯藝人合約' : '新增藝人合約'}
        >
          <ComUpload
            isEdit={isEdit}
            contractId={match.params.id}
            tmpFileList={tmpFileList}
            setTmpFileList={setTmpFileList}
            errHandler={errHandler}
          />
          <Card
            bordered={false}
          >
            <Row>
              <Col>
                <Form.Item
                  name="contract_author_types"
                  label={fieldLabels.contract_author_types}
                  className={styles.om_hide_label}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Checkbox.Group
                    options={optType}
                  />
                </Form.Item>
              </Col>
            </Row>
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
                  name="contract_code"
                  label={fieldLabels.contract_code}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                    {
                      validator(rule, values, callback) {
                        let result = valid.checkNotChinese(values);
                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkNotChinese_msg);
                        }
                      }
                    },
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
                  name="contract_signing_date"
                  label="簽約日期"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormNextContractAPI
                  form={form}
                  isLabel={fieldLabels.next_contract_id}
                  isName="next_contract_id"
                  isSelectText="next_contract_code"
                  isList={nextContractList}
                  setIsList={setNextContractList}
                  isDisabled={disabledNextContract}
                  isInfoContractCode={
                    (isEdit && info.basic_info && info.basic_info.contract_code)
                      ? (info.basic_info.contract_code)
                      : ('')
                  }
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel="我方簽約單位"
                  isName="party_a_company_id"
                  isSelectText="party_a_company_name"
                  isList={partyACompanyList}
                  setIsList={setPartyACompanyList}
                  cpCodeLabel={partyACompanyCodeLabel}
                  setCpCodeLabel={setPartyACompanyCodeLabel}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNickNameAuthorName
                  form={form}
                  isLabel="簽約對象"
                  isRequired={true}
                  changeToCompanyName={true}
                  isUiSelectVal={partyBObjectAuthorSelectVal}
                  isSetUiSelectVal={setPartyBObjectAuthorSelectVal}
                  isCpName="party_b_object_company_id"
                  isCpSelectText="party_b_object_company_name"
                  isCpList={partyBObjectCompanyList}
                  setIsCpList={setPartyBObjectCompanyList}
                  cpCodeLabel={partyBObjectCompanyCodeLabel}
                  setCpCodeLabel={setPartyBObjectCompanyCodeLabel}
                  isAtName="party_b_object_author_id"
                  isAtSelectText="party_b_object_author_name"
                  isAtList={partyBObjectAuthorList}
                  setIsAtList={setPartyBObjectAuthorList}
                  atCodeLabel={partyBObjectAuthorCodeLabel}
                  setAtCodeLabel={setPartyBObjectAuthorCodeLabel}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel="簽約單位"
                  isName="party_b_company_id"
                  isSelectText="party_b_company_name"
                  isList={partyBCompanyList}
                  setIsList={setPartyBCompanyList}
                  cpCodeLabel={partyBCompanyCodeLabel}
                  setCpCodeLabel={setPartyBCompanyCodeLabel}
                />

              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormContractGroup
                  form={form}
                  contractGroup={contractGroup}
                  setContractGroup={setContractGroup}
                  showConfirmExitContractGroup={showConfirmExitContractGroup}
                  groupMember={
                    (info.contract_group && info.contract_group.length > 0)
                      ? (info.contract_group)
                      : ([])
                  }
                />
              </Col>
            </Row>
          </Card>

          <Card
            bordered={false}
            className={styles.card}
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="contract_start_date"
                  label={fieldLabels.contract_start_date}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="renewal_period"
                  label="續約年限"
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let result = true;
                        const valReg = /^[0-9]{1,}(.[05])?$/;

                        if (values && !valReg.test(values)) {
                          result = false;
                        }

                        if (result) {
                          callback();
                        } else {
                          callback('輸入格式錯誤，最小單位為半年，如 0.5');
                        }
                      }
                    }
                  ]}
                >
                  <Input
                    disabled={disabledRenewalPeriod}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="contract_termination_date_radio"
                  label={fieldLabels.contract_termination_date_radio}
                  style={{ marginBottom: '8px' }}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Radio.Group
                    options={[
                      { label: '無', value: '0' },
                      { label: '有', value: '1' },
                    ]}
                    disabled={disabledContractTerminationDate}
                    onChange={() => { changeFormItem('contract_termination_date_radio'); }}
                  />
                </Form.Item>
                <Form.Item
                  name="contract_termination_date"
                  label={fieldLabels.contract_termination_date}
                  className={styles.om_hide_label}
                  style={{ display: (showContractTerminationDate) ? 'block' : 'none' }}
                  dependencies={['contract_start_date', 'is_permanent', 'is_buyout']}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        // if '合約提前終止 radio' 為 1 && '!永久' && '!買斷' 則必填
                        // else if '合約提前終止 radio' 為 1 && (兩者皆有值(合約開始日, 合約提前終止) && 合約提前終止 - 合約開始日 <= 0　&& '!永久' && '!買斷')
                        if (form.getFieldValue()['contract_termination_date_radio'] == '1' && !checkDateRequired(form.getFieldValue()['contract_termination_date']) && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'合約提前終止\' 須大於 \'合約開始日\'');
                        } else if (form.getFieldValue()['contract_termination_date_radio'] == '1' && checkDateRequired(form.getFieldValue()['contract_start_date']) && checkDateRequired(form.getFieldValue()['contract_termination_date']) && new Date(form.getFieldValue()['contract_termination_date'].format(dateFormat)) - new Date(form.getFieldValue()['contract_start_date'].format(dateFormat)) <= 0 && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'合約提前終止\' 須大於 \'合約開始日\'');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabledContractTerminationDate}
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
                  name="contract_end_date"
                  label={fieldLabels.contract_end_date}
                  className={styles.addRequiredStar}
                  dependencies={['contract_start_date', 'is_permanent', 'is_buyout']}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        // if '!永久' && '!買斷' 則必填
                        // else if(兩者皆有值(合約到期日, 合約開始日) && 合約到期日 - 合約開始日 <= 0　&& '!永久' && '!買斷')
                        if (!checkDateRequired(form.getFieldValue()['contract_end_date']) && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'合約到期日\' 須大於 \'合約開始日\'');
                        } else if (checkDateRequired(form.getFieldValue()['contract_start_date']) && checkDateRequired(form.getFieldValue()['contract_end_date']) && new Date(form.getFieldValue()['contract_end_date'].format(dateFormat)) - new Date(form.getFieldValue()['contract_start_date'].format(dateFormat)) <= 0 && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'合約到期日\' 須大於 \'合約開始日\'');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabledContractEndDate}
                    onChange={() => { changeFormItem('contract_end_date'); }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="rights_end_date"
                  label={fieldLabels.rights_end_date}
                  dependencies={['contract_expiry_date', 'is_permanent', 'is_buyout']}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        // else if(兩者皆有值(代理/發行到期日, 合約有效日) && 代理/發行到期日 - 合約有效日 < 0　&& '!永久' && '!買斷')
                        if (checkDateRequired(form.getFieldValue()['rights_end_date']) && checkDateRequired(form.getFieldValue()['contract_expiry_date']) && new Date(form.getFieldValue()['rights_end_date'].format(dateFormat)) - new Date(form.getFieldValue()['contract_expiry_date'].format(dateFormat)) < 0 && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'代理/發行到期日\' 須大於或相等 \'合約有效日\'');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabledRightsEndDate}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="rights_termination_date_radio"
                  label={fieldLabels.rights_termination_date_radio}
                  style={{ marginBottom: '8px' }}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Radio.Group
                    options={[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' },
                    ]}
                    disabled={disabledRightsTerminationDateRadio}
                    onChange={() => { changeFormItem('rights_termination_date_radio'); }}
                  />
                </Form.Item>
                <Form.Item
                  name="rights_termination_date"
                  label={fieldLabels.rights_termination_date}
                  className={styles.om_hide_label}
                  style={{ display: (showRightsTerminationDate) ? 'block' : 'none' }}
                  dependencies={['rights_termination_date_radio', 'contract_start_date', 'is_permanent', 'is_buyout']}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        // if '承上，是否提前終止代理到期日？' 為 1 && '!永久' && '!買斷' 則必填
                        // else if('承上，是否提前終止代理到期日？'為 1 && 兩者皆有值(合約開始日, 代理到期日提前終止) && 代理到期日提前終止 - 合約開始日 <= 0　&& '!永久' && '!買斷')
                        if (form.getFieldValue()['rights_termination_date_radio'] == '1' && !checkDateRequired(form.getFieldValue()['rights_termination_date']) && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'代理到期日提前終止\' 須大於 \'合約開始日\'');
                        } else if (form.getFieldValue()['rights_termination_date_radio'] == '1' && checkDateRequired(form.getFieldValue()['contract_start_date']) && checkDateRequired(form.getFieldValue()['rights_termination_date']) && new Date(form.getFieldValue()['rights_termination_date'].format(dateFormat)) - new Date(form.getFieldValue()['contract_start_date'].format(dateFormat)) <= 0 && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('\'代理到期日提前終止\' 須大於 \'合約開始日\'');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    disabled={disabledRightsTerminationDateRadio}
                    style={{ width: '100%' }}
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
                  name="contract_expiry_date"
                  label={fieldLabels.contract_expiry_date}
                  className={styles.addRequiredStar}
                  dependencies={['is_permanent', 'is_buyout']}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        // if '!永久' && '!買斷' 則必填確認
                        if (!checkDateRequired(form.getFieldValue()['contract_expiry_date']) && form.getFieldValue()['is_permanent'] != '1' && form.getFieldValue()['is_buyout'] != '1') {
                          callback('此欄位為必填');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={disabledContractExpiryDate}
                    onChange={() => { changeFormItem('contract_expiry_date'); }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="is_permanent"
                  label="永久"
                >
                  <Radio.Group
                    options={[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' },
                    ]}
                    disabled={disabledIsPermanent}
                    onChange={() => { changeFormItem('is_permanent'); }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormArea
                  form={form}
                  isLabel="授權地區"
                  isNameAreaRadioTypeRadio="authorized_area_type_radio"
                  isNameAreaIdInputCountrys="authorized_area_id_input_countrys"
                  isNameAreaId="authorized_area_id"
                  isNameAreaTypeSelect="authorized_area_type_select"
                  isNameAreaIdInput2Countrys="authorized_area_id_input2_countrys"
                  isInit={initAuthorizedArea}
                  setIsInit={setInitAuthorizedArea}
                  initAuthorizedAreaList={
                    (isEdit)
                      ? (initAuthorizedAreaList)
                      : ([])
                  }
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={authorizedAreaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAuthorizedAreaCountry2Disabled}
                />

              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="published_album_quantity"
                  label="專輯發行數量"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="is_buyout"
                  label="買斷"
                >
                  <Radio.Group
                    options={[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' },
                    ]}
                    onChange={() => { changeFormItem('is_buyout'); }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyList
                  form={form}
                  isName="media_owners_1"
                  isLabel="母帶權利人"
                  cpList={mediaOwners1List}
                  setCpList={setMediaOwners1List}
                  cpCodeList={mediaOwners1CodeList}
                  setCpCodeList={setMediaOwners1CodeList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyList
                  form={form}
                  isName="media_owners_2"
                  isLabel="視聽著作權人"
                  cpList={mediaOwners2List}
                  setCpList={setMediaOwners2List}
                  cpCodeList={mediaOwners2CodeList}
                  setCpCodeList={setMediaOwners2CodeList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyList
                  form={form}
                  isName="media_owners_3"
                  isLabel="語文著作權人"
                  cpList={mediaOwners3List}
                  setCpList={setMediaOwners3List}
                  cpCodeList={mediaOwners3CodeList}
                  setCpCodeList={setMediaOwners3CodeList}
                />
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="其他"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="notes"
                  label="備註"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="拆分"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <ComSplitInfoText />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <Form.Item
                  name="currency_id"
                  label="幣別"
                  style={{ width: '150px' }}
                >
                  <Select
                    options={contractSongList.optCurrency}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                <table className={styles.formTable}>
                  <tbody>
                    <FormSplit
                      form={form}
                      isGrayTag="實體"
                      isTd="CD"
                      isName="split_1"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="DVD"
                      isName="split_2"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="卡帶"
                      isName="split_3"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="黑膠"
                      isName="split_4"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isGrayTag="數位"
                      isTd="Vocal"
                      isName="split_5"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="Video"
                      isName="split_6"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="營業用單曲"
                      isName="split_7"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="明星商品"
                      isName="split_8"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="書籍"
                      isName="split_9"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="電子書"
                      isName="split_10"
                      countryList={authorizedCountryList.countryList}
                    />
                    <tr><td>&nbsp;</td></tr>
                    <FormSplit
                      form={form}
                      isTd="其他"
                      isName="split_11"
                      countryList={authorizedCountryList.countryList}
                    />
                    <FormSplit
                      form={form}
                      isTd="特殊"
                      isName="split_12"
                      countryList={authorizedCountryList.countryList}
                    />
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card>
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
    </Spin >
  );
}

export default connect(({ contractAuthorList, authorizedAreaList, authorizedCountryList, contractSongList, loading }) => ({
  contractAuthorList,
  authorizedAreaList,
  authorizedCountryList,
  contractSongList,
  loadingMultiGetContractAuthorInfo: loading.effects['contractAuthorList/fetchMultiGetContractAuthorInfo'],
  loadingExitContractGroup: loading.effects['contractAuthorList/fetchExitContractGroup'],
  loadingEditContractAuthorForm: loading.effects['contractAuthorList/fetchEditContractAuthorForm'],
  loadingAddContractAuthorForm: loading.effects['contractAuthorList/fetchAddContractAuthorForm'],
}))(update);

import React, { useState, useEffect, Fragment } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Button,
  Spin,
} from 'antd';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import miscFn from '../../fn';
import FormSongId from './FormSongId';
import FormContractAuthorId from './FormContractAuthorId';
import ComUiSong from './ComUiSong';
import valid from '@/fn/valid';

const { Option } = Select;
const { TextArea } = Input;

export const ComContentEdit = props => {
  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const { confirm } = Modal;
  const [uiSongItem, setUiSongItem] = useState({});
  const {
    dispatch,
    loadingEditMiscForm,
    miscList: { optType, optDistributionFormat, info },
    useTypeList,
    isEdit,
    setIsEdit,
    parentIdx,
    parentElem,
    getData,
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  // song_id
  const [songIdList, setSongIdList] = useState([]);
  // contract_author_id
  const [contractAuthorIdList, setContractAuthorIdList] = useState([]);
  const [contractAuthorPartyB, setContractAuthorPartyB] = useState('');
  const [contractAuthorUiIdName, setContractAuthorUiIdName] = useState('');
  // uiSong, uiPack (1, 2)
  const [showUiSongOrPack, setShowUiSongOrPack] = useState('1');
  // ComUiSong
  const [updateComUiSong, setUpdateComUiSong] = useState(0);

  // ui -----
  useEffect(() => {
    let newItem = miscFn.createContentContructor();
    newItem.id = parentElem.id;
    newItem.cm_id = parentElem.cm_id;
    newItem.name = parentElem.name;
    newItem.use_type_id = parentElem.use_type_id;
    newItem.type = parentElem.type;
    newItem.song_id = parentElem.song_id;
    newItem.song_code = parentElem.song_code;
    newItem.song_name = parentElem.song_name;
    newItem.distribution_format = parentElem.distribution_format;
    newItem.ui_contract_author_id = (parentElem.contract_author_id) ? (`${parentElem.contract_author_id}_${(parentElem.contract_author_subcontract_id) ? (parentElem.contract_author_subcontract_id) : ('')}`) : ('');
    newItem.lyrics = (parentElem.lyrics) ? (parentElem.lyrics.slice()) : [];  // 若沒改變 (is_edit) 直接用 lyrics 下發
    newItem.record = (parentElem.record) ? (parentElem.record.slice()) : []; // 若沒改變 (is_edit) 直接用 record 下發
    newItem.ui_song = miscFn.createUiSong(
      parentElem.notes,
      parentElem.flat_fee,
      parentElem.syn_fee,
      parentElem.mech_flat_fee,
      parentElem.isrc_id,
      parentElem.amount
    );
    newItem.is_edit = '0';

    let newList = miscFn.createUiListItem();
    if (parentElem.type == '1') {
      // isrc 選項
      if (parentElem.isrc_id) {
        newList.isrcOpts = [{
          value: parentElem.isrc_id,
          label: parentElem.isrc,
        }];
      }

      if (parentElem.lyrics) {
        for (let j = 0; j < parentElem.lyrics.length; j++) {
          let tmpLyricsItem = parentElem.lyrics[j];

          newItem.ui_song.split_id.push(tmpLyricsItem.commission_id);
          newList.rightList.push({
            name: tmpLyricsItem.name,
            rights_type: tmpLyricsItem.song_right_type_name,
            rights_ratio: tmpLyricsItem.rights_ratio,
            song_right_id: tmpLyricsItem.song_right_id,
            contract_song_id: tmpLyricsItem.contract_song_id,
            author_id: tmpLyricsItem.author_id,
          });
          newList.rightSplitOpts.push([{
            value: tmpLyricsItem.commission_id,
            label: miscFn.convertSplitOptStr(tmpLyricsItem.split_type)
          }]);
        }
      }

      if (parentElem.record) {
        for (let k = 0; k < parentElem.record.length; k++) {
          let tmpRecordItem = parentElem.record[k];

          newItem.ui_song.isrc_comission_id.push(tmpRecordItem.commission_id);
          newList.isrcSingerList.push({
            author_name: tmpRecordItem.name,
            isrc_split_id: tmpRecordItem.isrc_split_id,
            author_id: tmpRecordItem.author_id,
            contract_author_id: tmpRecordItem.contract_author_id,
          });
          newList.isrcSplitOpts.push([{
            value: tmpRecordItem.commission_id,
            label: miscFn.convertSplitOptStr(tmpRecordItem.split_type)
          }]);
        }
      }
    } else {
      if (newItem.ui_contract_author_id) {
        setContractAuthorUiIdName((parentElem.contract_author_subcontract_id) ? (parentElem.contract_author_subcontract_code) : (parentElem.contract_author_code));
        setContractAuthorIdList([{
          ui_id: newItem.ui_contract_author_id,
          id: parentElem.contract_author_id,
          contract_code: parentElem.contract_author_code,
          subcontract_id: parentElem.contract_author_subcontract_id,
          subcontract_code: parentElem.contract_author_subcontract_code,
          subcontract_parent_author_name: parentElem.subcontract_parent_author_name,
          subcontract_author_name: parentElem.subcontract_author_name,
          label: `${parentElem.contract_author_code} ${(parentElem.contract_author_subcontract_code) ? (`(${parentElem.contract_author_subcontract_code})`) : ('')}`
        }]);
        setContractAuthorPartyB(
          (parentElem.settle_company_name)
            ? (parentElem.settle_company_name)
            : (
              (parentElem.subcontract_author_name)
                ? (parentElem.subcontract_author_name)
                : (
                  (parentElem.subcontract_parent_author_name)
                    ? (parentElem.subcontract_parent_author_name)
                    : ('')
                )
            )
        );
      } else {
        setContractAuthorUiIdName('');
        setContractAuthorIdList([]);
        setContractAuthorPartyB('');
      }

      if (parentElem.record) {
        for (let l = 0; l < parentElem.record.length; l++) {
          let tmpPackItem = parentElem.record[l];

          if (l == 0) {
            newItem.ui_song.pack_split_id = tmpPackItem.commission_id;
            newList.packSplitOpt.push({
              value: tmpPackItem.commission_id,
              label: miscFn.convertSplitOptStr(tmpPackItem.split_type)
            });
          } else {
            break;
          }
        }
      }
    }

    // showUiSongOrPack
    if (parentElem.type == '1') {
      setShowUiSongOrPack('1');
    } else {
      setShowUiSongOrPack('2');
    }

    // songIdList
    if (parentElem.type == '1' && parentElem.song_id) {
      setSongIdList([{
        id: parentElem.song_id,
        song_name: parentElem.song_name,
        song_code: parentElem.song_code,
      }]);
    } else {
      setSongIdList([]);
    }

    // uiSongItem
    setUiSongItem(newList);

    form.setFieldsValue({
      ...newItem,
    });

    setUpdateComUiSong((prev) => prev + 1);
  }, [isEdit]);

  const onFinish = values => {
    setError([]);
    let saveObj = { ...info };
    let item = { ...values };
    let obj = miscFn.createContentContructor(item.name, item.use_type_id, item.type);
    let splitUiContractAuthorId = [];

    const delItem = () => {
      obj.lyrics = (info.content[parentIdx].lyrics) ? (info.content[parentIdx].lyrics.map((elem) => ({ ...elem, is_delete: '1' }))) : [];
      obj.record = (info.content[parentIdx].record) ? (info.content[parentIdx].record.map((elem) => ({ ...elem, is_delete: '1' }))) : [];
    };

    const newItem = () => {
      obj.is_edit = '1';
      obj.id = info.content[parentIdx].id;
      obj.cm_id = info.content[parentIdx].cm_id;
      obj.notes = (item.ui_song && item.ui_song.notes) ? (item.ui_song.notes) : (null);

      // 判斷 '1 歌曲' 或 '2 pack'
      if (item.type == '1') {
        obj.song_id = (item.song_id) ? (item.song_id) : (null);
        obj.distribution_format = item.distribution_format;
        obj.flat_fee = (item.ui_song && item.ui_song.flat_fee) ? (item.ui_song.flat_fee) : (null);
        obj.syn_fee = (item.ui_song && item.ui_song.syn_fee) ? (item.ui_song.syn_fee) : (null);
        obj.mech_flat_fee = (item.ui_song && item.ui_song.mech_flat_fee) ? (item.ui_song.mech_flat_fee) : (null);
        obj.isrc_id = (item.ui_song && item.ui_song.isrc_id) ? (item.ui_song.isrc_id) : (null);
        obj.amount = (item.ui_song && item.ui_song.amount) ? (item.ui_song.amount) : (null);

        if (uiSongItem && uiSongItem.rightList) {
          for (let j = 0; j < uiSongItem.rightList.length; j++) {
            let tmpRightItem = uiSongItem.rightList[j];

            if (tmpRightItem && tmpRightItem.song_right_id) {
              obj.lyrics.push({
                is_new: '1',
                cmc_id: (info.content[parentIdx].id) ? (info.content[parentIdx].id) : null,
                author_id: tmpRightItem.author_id,
                song_right_id: tmpRightItem.song_right_id,
                commission_id: (item.ui_song && item.ui_song.split_id && item.ui_song.split_id[j]) ? (item.ui_song.split_id[j]) : null,
              })
            }
          }
        }

        if (uiSongItem && uiSongItem.isrcSingerList) {
          for (let k = 0; k < uiSongItem.isrcSingerList.length; k++) {
            let tmpIsrcSingerList = uiSongItem.isrcSingerList[k];

            if (tmpIsrcSingerList && item.ui_song && item.ui_song.isrc_comission_id) {
              obj.record.push({
                is_new: '1',
                cmc_id: (info.content[parentIdx].id) ? (info.content[parentIdx].id) : null,
                author_id: tmpIsrcSingerList.author_id,
                isrc_split_id: (tmpIsrcSingerList.isrc_split_id) ? (tmpIsrcSingerList.isrc_split_id) : null,
                commission_id: (item.ui_song && item.ui_song.isrc_comission_id && item.ui_song.isrc_comission_id[k]) ? (item.ui_song.isrc_comission_id[k]) : null,
              });
            }
          }
        }
      } else {
        obj.amount = (item.ui_song && item.ui_song.amount) ? (item.ui_song.amount) : (null);

        if (item.ui_contract_author_id) {
          splitUiContractAuthorId = item.ui_contract_author_id.split('_');

          obj.contract_author_id = (splitUiContractAuthorId[0]) ? (splitUiContractAuthorId[0]) : null;
          obj.contract_author_subcontract_id = (splitUiContractAuthorId[1]) ? (splitUiContractAuthorId[1]) : null;
        }

        if (item.ui_song && item.ui_song.pack_split_id) {
          obj.record.push({
            is_new: '1',
            cmc_id: (info.content[parentIdx].id) ? (info.content[parentIdx].id) : null,
            author_id: null,
            isrc_split_id: null,
            commission_id: item.ui_song.pack_split_id,
          });
        }
      }
    };

    delItem();
    newItem();
    saveObj.authorized_country_id = [];
    saveObj.content = [];
    saveObj.content.push(obj);

    // delete parameter
    delete saveObj.authorized_area_type_radio;
    delete saveObj.authorized_area_type_select;
    delete saveObj.authorized_area_id_input2_countrys;
    delete saveObj.authorized_area_id_input_countrys;
    delete saveObj.ui_contract_year;
    delete saveObj.ui_contract_month;

    // dispatch
    dispatch({
      type: 'miscList/fecthEditMiscForm',
      payload: saveObj,
      callback: (result) => {
        if (result == 'ok') {
          setIsEdit(false);
          getData();
        }
      }
    });
  }

  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  }

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        setIsEdit(false);
      },
      onCancel() { },
    });
  }

  // getContractAuthorSplitData 
  const getContractAuthorSplitData = (isrcData) => {
    return new Promise((resolve, reject) => {
      let contractid = (isrcData && isrcData.contract_author_id) ? (isrcData.contract_author_id) : '';

      fetch(`${window.FRONTEND_WEB}/contract_author?contract_author_id=${contractid}`)
        .then(res => res.json())
        .then(jsonData => {
          let opts = [];

          if (jsonData.data && jsonData.data.split_information) {
            for (let i = 0; i < jsonData.data.split_information.length; i++) {
              let splitItem = jsonData.data.split_information[i];
              let typeNameList = ['CD', 'DVD', '卡帶', '黑膠', '數位-Vocal', '數位-Video', '營業用單曲', '明星商品', '書籍', '電子書', '其他', '特殊'];
              let typeId = parseInt(splitItem.contract_author_split_item_id);
              let tmpLabel = '';

              if (!splitItem.id) {
                continue;
              }

              if (!isNaN(typeId) && typeId >= 1 && typeId <= 12) {
                tmpLabel = typeNameList[typeId - 1];
              }

              if (splitItem.is_specified_country == '0') {
                tmpLabel += '-其他地區';
              } else if (splitItem.is_specified_country == '1' && splitItem.country && splitItem.country.country_name_zh) {
                tmpLabel += `-${splitItem.country.country_name_zh}`;
              }

              opts.push({ value: splitItem.id, label: tmpLabel });
            }
          }

          resolve(opts)
        }).catch(err => {
          resolve([]);
        });
    });
  }

  // getIsrcSplitData
  const getIsrcSplitData = (isrcId) => {
    return new Promise((resolve, reject) => {
      if (!isrcId) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/isrc/detail_split?isrc_id=${isrcId}`)
          .then(res => res.json())
          .then(jsonData => {
            let tmpData = (jsonData.data) ? (jsonData.data) : ([]);

            resolve(tmpData);
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  // getUiSongDataForIsrc
  const getUiSongDataForIsrc = (isrcId, fromOther) => {
    return new Promise((resolve, reject) => {
      setViewLoading(true);

      getIsrcSplitData(isrcId).then((result) => {
        let tmpResult = [];

        if (result) {
          tmpResult = result;
        }

        setUiSongItem((prev) => {
          let tmpList = { ...prev };

          if (!tmpList) {
            tmpList = {};
          }

          tmpList['isrcSingerList'] = (tmpResult) ? (tmpResult.map((elem) => ({ ...elem, isrc_split_id: elem.id }))) : ([]);
          tmpList['isrcSplitOpts'] = tmpResult.map((elem) => []);

          return tmpList;
        });

        let tmpUiSong = form.getFieldValue()['ui_song'];
        if (!tmpUiSong) {
          tmpUiSong = {};
        }
        tmpUiSong['isrc_id'] = isrcId;
        tmpUiSong['isrc_comission_id'] = (tmpResult.length > 0) ? (tmpResult.map((elem) => '')) : [];
        form.setFieldsValue({ ui_song: tmpUiSong });

        if (!fromOther) {
          setUpdateComUiSong((prev) => prev + 1);
          setViewLoading(false);
        }

        resolve();
      });
    });
  }

  // getRightData
  const getRightData = (songCode, idx) => {
    return new Promise((resolve, reject) => {
      let tmpObj = {
        song_code: songCode,
        type: form.getFieldValue()['distribution_format'],
        sold_date: info.sold_date,
      };

      if (!tmpObj.song_code || !tmpObj.type || !tmpObj.sold_date) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/contract_karaoke/get_song_rights`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(tmpObj),
        })
          .then(res => res.json())
          .then(jsonData => {
            resolve((jsonData.data) ? (jsonData.data) : ([]));
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  // getIsrcData
  const getIsrcData = (songCode) => {
    return new Promise((resolve, reject) => {
      if (!songCode) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${songCode}`)
          .then(res => res.json())
          .then(jsonData => {
            let tmpData = (jsonData.data && jsonData.data.data_list) ? (jsonData.data.data_list) : ([]);

            tmpData = tmpData.map((elem) => ({ value: elem.id, label: elem.isrc }));

            resolve(tmpData);
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  // getContractSplitData
  const getContractSplitData = (rightData) => {
    return new Promise((resolve, reject) => {
      let contractid = (rightData && rightData.contract_song_id) ? (rightData.contract_song_id) : '';

      fetch(`${window.FRONTEND_WEB}/contract_song/view?id=${contractid}`)
        .then(res => res.json())
        .then(jsonData => {
          let opts = [];

          if (jsonData.data && jsonData.data.commission) {
            for (let i = 0; i < jsonData.data.commission.length; i++) {
              for (let j = 0; j < jsonData.data.commission[i].percentage.length; j++) {
                let percentItem = jsonData.data.commission[i].percentage[j];

                opts.push({ value: percentItem.id, label: `${jsonData.data.commission[i].name} - ${percentItem.name}` })
              }
            }
          }

          resolve(opts)
        }).catch(err => {
          resolve([]);
        });
    });
  }

  // getUiSongData
  const getUiSongData = (songCode, idx, notViewLoading) => {
    return new Promise((resolve, reject) => {
      if (!notViewLoading) {
        setViewLoading(true);
      }

      getRightData(songCode, idx).then((result) => {
        let tmpResult = [];

        if (result) {
          tmpResult = result.filter((elem) => elem.contract_song_id && elem.default_settle_company == '1').map((elem) => ({
            ...elem,
            rights_type: elem.song_right_type,
            rights_ratio: elem.song_right_ratio,
            name: elem.author_pen_name,
          }));
        }

        setUiSongItem((prev) => {
          let tmpList = { ...prev };

          if (!tmpList) {
            tmpList = {};
          }

          tmpList['rightList'] = tmpResult;
          tmpList['rightSplitOpts'] = tmpResult.map((elem) => []);

          return tmpList;
        });

        let tmpUiSong = form.getFieldValue()['ui_song'];
        if (!tmpUiSong) {
          tmpUiSong = {};
        }
        tmpUiSong['split_id'] = (tmpResult.length > 0) ? (tmpResult.map((elem) => '')) : [];
        form.setFieldsValue({ ui_song: tmpUiSong });

        return getIsrcData(songCode);
      }).then((result2) => {
        setUiSongItem((prev) => {
          let tmpList2 = { ...prev };

          if (!result2) {
            result2 = {};
          }

          tmpList2['isrcOpts'] = result2;

          return tmpList2;
        });

        let tmpUiSong = form.getFieldValue()['ui_song'];

        if (!tmpUiSong) {
          tmpUiSong = {};
        }

        tmpUiSong['isrc_id'] = '';
        form.setFieldsValue({ ui_song: tmpUiSong });

        return getUiSongDataForIsrc('', idx, true);
      }).then(() => {
        setUpdateComUiSong((prev) => prev + 1);

        if (!notViewLoading) {
          setViewLoading(false);
        }

        resolve();
      });
    });
  }

  const getUiSongDataForPack = () => {
    let tmpUiSong = form.getFieldValue()['ui_song'];

    if (!tmpUiSong) {
      tmpUiSong = {};
    }

    tmpUiSong['pack_split_id'] = '';
    form.setFieldsValue({ ui_song: tmpUiSong });

    setUiSongItem((prev) => {
      let tmpUiSongItem = { ...prev };

      tmpUiSongItem.packSplitOpt = [];

      return tmpUiSongItem;
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingEditMiscForm || viewLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[64, 24]}
          style={{ display: 'none' }}
        >
          <Col xs={24}>
            <Form.Item
              name="is_edit"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[64, 24]}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="產品名稱"
              name="name"
              rules={[
                { required: true, message: '此欄位為必填' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="使用方式"
              name="use_type_id"
              rules={[
                { required: true, message: '此欄位為必填' }
              ]}
            >
              <Select
                options={
                  (useTypeList.allList)
                    ? (useTypeList.allList.map((elem) => ({ value: elem.id, label: elem.name })))
                    : ([])
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[64, 24]}>
          <Col xs={24} lg={8}>
            <Form.Item
              label="型態"
              name="type"
            >
              <Radio.Group
                options={optType}
                onChange={(e) => {
                  form.setFieldsValue({ is_edit: '1' });
                  setShowUiSongOrPack(e.target.value.toString());
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* 歌曲 */}
        <Row
          gutter={[64, 24]}
          style={{ display: (showUiSongOrPack != '2') ? ('flex') : ('none') }}
        >
          <Col xs={24} lg={8}>
            <FormSongId
              form={form}
              isList={songIdList}
              setIsList={setSongIdList}
              getUiSongData={getUiSongData}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="歌曲編號"
              shouldUpdate
            >
              {() => {
                return form.getFieldValue().song_code ? form.getFieldValue().song_code : '';
              }}
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label="權利型態"
              name="distribution_format"
              className={styles.addRequiredStar}
              rules={[
                {
                  validator(rule, values, callback) {
                    let result = true;

                    if (form.getFieldValue().type == '1') {
                      result = valid.checkRequired(values);
                    }

                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkRequired_msg);
                    }
                  }
                },
              ]}
            >
              <Radio.Group
                options={optDistributionFormat}
                onChange={() => {
                  let tmpSongCode = form.getFieldValue()['song_code'];

                  getUiSongData((tmpSongCode) ? (tmpSongCode) : (''));
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* pack */}
        <Row
          gutter={[64, 24]}
          style={{ display: (showUiSongOrPack == '2') ? ('flex') : ('none') }}
        >
          <Col xs={24} lg={8}>
            <FormContractAuthorId
              form={form}
              soldDate={info.sold_date}
              isList={contractAuthorIdList}
              setIsList={setContractAuthorIdList}
              getUiSongDataForPack={getUiSongDataForPack}
              setContractAuthorPartyB={setContractAuthorPartyB}
              isName={contractAuthorUiIdName}
              setIsName={setContractAuthorUiIdName}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              label=" "
            >
              <label>簽約對象：{contractAuthorPartyB}</label>
            </Form.Item>
          </Col>
        </Row>
        {/* 共用 */}
        <Row gutter={[64, 24]}>
          <Col xs={24} className={styles.om_overflow_auto}>
            <Form.Item
              name="ui_song"
            >
              <ComUiSong
                form={form}
                uiSongItem={(uiSongItem) ? (uiSongItem) : ({})}
                setUiSongItem={setUiSongItem}
                getContractSplitData={getContractSplitData}
                updateComUiSong={updateComUiSong}
                getUiSongDataForIsrc={getUiSongDataForIsrc}
                getContractAuthorSplitData={getContractAuthorSplitData}
                showUiSongOrPack={
                  (showUiSongOrPack && showUiSongOrPack == '2')
                    ? ('2')
                    : ('1')
                }
                getIsrcData={getIsrcData}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[64, 24]}>
          <Col xs={24}
            style={{ textAlign: 'right' }}
          >
            <Form.Item>
              <div
                style={{ textAlign: 'right' }}
              >
                <Button
                  className={styles.om_sp_m_lt}
                  onClick={showConfirm}
                >取消</Button>
                <Button
                  type="primary"
                  className={`${styles.submitBtnWidth} ${styles.om_sp_m_lt}`}
                  onClick={() => form?.submit()}
                >送出</Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}

export default connect(({ miscList, useTypeList, loading }) => ({
  miscList,
  useTypeList,
  loadingEditMiscForm: loading.effects['miscList/fecthEditMiscForm'],
}))(ComContentEdit);
import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Form,
  InputNumber,
  Select,
  Tooltip,
} from 'antd';
import { PlusOutlined, CloseOutlined, } from "@ant-design/icons";
import FormAuthorId from './FormAuthorId';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';
const { Option } = Select;

export const ComRecord = props => {
  const {
    form,
    info,
    changeId,
    ui_options_author,
    setViewLoading,
    getErrorInfo
  } = props;

  // author_id
  const [authorIdList, setAuthorIdLIst] = useState([]);
  const [authorCodeLabel, setAuthorCodeLabel] = useState([]);
  // select
  const [contentInfo, setContentInfo] = useState([]);
  const [contentOption, setContentOption] = useState([]);
  // contract_author_id
  const [contractAuthorIdOpt, setContractAuthorIdOpt] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // 適用合約 all (初始畫面)
  const requestAuthorContract = (author_id) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.FRONTEND_WEB}/contract_author/contracts_belong_to_author_without_release_date?author_id=${author_id}`)
        .then(res => res.json())
        .then(jsonData => {
          let tmpIsList = [];
          if (jsonData && jsonData.data) {
            for (let i = 0; i < jsonData.data.length; i++) {
              const itemList = jsonData.data[i];
              let item = itemList.contract_author;
              if (item && item.id && item.contract_code) {
                tmpIsList.push({
                  value: item.id,
                  label: (itemList.subcontract_code) ? (itemList.subcontract_code + ' (子約)') : (item.contract_code),
                  subcontract_id: (itemList.subcontract_id) ? (itemList.subcontract_id) : null
                });
              }
            }
          }
          resolve(tmpIsList);
        }).catch(err => {
          resolve([]);
        });
    });
  }

  // updateData 
  useEffect(() => {
    setViewLoading(true);
    if (info && info.ui_replace_settle_record && info.ui_author_code_record) {
      // show author_code
      const list = info.ui_replace_settle_record
      let tmpOpt = [];
      let ary = form.getFieldsValue().ui_replace_settle_record.slice();
      for (let i = 0; i < list.length; i++) {
        tmpOpt.push([{
          id: list[i].author_id,
          name: list[i].author_name,
          author_code: list[i].author_code,
        }]);

        ary[i]['ui_option_selected'] = [...list[i].content]; // 已經選擇的合約資料
      }
      setAuthorIdLIst(tmpOpt);
      setAuthorCodeLabel(info.ui_author_code_record);

      // author_contract option
      let authorIds = list.map((elem) => (elem.author_id) ? (elem.author_id) : null);
      let requests = authorIds.map(item => requestAuthorContract(item));
      Promise.all(requests).then(res => {
        let tmpContractIdList = [];
        for (let m = 0; m < res.length; m++) {
          let tmpOpt = [];
          for (let n = 0; n < res[m].length; n++) {
            let tmpIsrcItem = { ...res[m][n] };
            tmpOpt.push(tmpIsrcItem);
          }
          tmpContractIdList.push(tmpOpt);
          ary[m]['ui_option_data'] = tmpOpt; // 當筆的所有合約
        }
        setContractAuthorIdOpt(tmpContractIdList);
        setViewLoading(false);
        form.setFieldsValue({ ui_replace_settle_record: ary })
      });
    }
  }, [changeId]);

  // contract: onchange 載入應要 viewLoading，當藝人清空，應也要清空
  const changeAuthorContract = (keyword, idx) => {
    setViewLoading(true);
    setIsFetching(true);
    let arr = form.getFieldValue().ui_replace_settle_record;
    let tmpAuthorId = '';
    if (arr && arr[idx] && arr[idx].author_id) {
      tmpAuthorId = arr[idx].author_id;
    }

    commFn.searchOption(keyword, '/contract_author/contracts_belong_to_author_without_release_date', (res) => {
      let ary = form.getFieldsValue().ui_replace_settle_record.slice();
      let tmpIsList = contractAuthorIdOpt.slice();
      tmpIsList[idx] = [];

      for (let i = 0; i < res.length; i++) {
        let item = res[i].contract_author;
        if (item && item.id && item.contract_code) {
          tmpIsList[idx].push({
            value: item.id,
            label: (res[i].subcontract_code) ? (res[i].subcontract_code + ' (子約)') : (item.contract_code),
            subcontract_id: (res[i].subcontract_id) ? (res[i].subcontract_id) : null
          });
        }
      }
      ary[idx]['ui_option_data'] = tmpIsList[idx];
      setContractAuthorIdOpt(tmpIsList);
      setViewLoading(false);
      setIsFetching(false);
    }, [{ key: 'author_id', value: tmpAuthorId }]);
  }

  function addIsEdit(idx) {
    let ary = form.getFieldValue().ui_replace_settle_record.slice();
    if (ary[idx]['id']) {
      ary[idx]['is_edit'] = "1";
    }
  }

  return (
    <Fragment>
      <h4 style={{ fontWeight: 'bold' }}>錄音</h4>
      <Form.List name="ui_replace_settle_record">
        {(fields, { add, remove }, { errors }) => {
          let arr = form.getFieldValue().ui_replace_settle_record;
          let num = 0;
          return (
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th>適用藝人</th>
                  <th>適用合約</th>
                  <th>扣佣比例(%)</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              {(info && info.ui_replace_settle_record) && (
                <tbody>
                  {fields.map((field, idx) => {
                    if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                      num++;
                    }
                    return (
                      <tr
                        key={`ui_replace_settle_record_${field.key}`}
                        style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                      >
                        <td>{/*適用藝人*/}
                          <FormAuthorId
                            form={form}
                            field={field}
                            idx={idx}
                            aryListName="ui_replace_settle_record"
                            isList={authorIdList}
                            setIsList={setAuthorIdLIst}
                            authorCodeLabel={authorCodeLabel}
                            setAuthorCodeLabel={setAuthorCodeLabel}
                            changeFn={changeAuthorContract}
                          />
                        </td>
                        <td>{/*適用合約*/}
                          <Form.Item
                            {...field}
                            name={[field.name, 'ui_contract_author_id']}
                            fieldKey={[field.fieldKey, 'ui_contract_author_id']}
                            key={`ui_contract_author_id_${field.fieldKey}`}
                            initialValue={[]}
                            rules={[
                              {
                                validator(rule, values, callback) {
                                  if (form.getFieldValue().ui_replace_settle_record[idx]['is_delete'] != '1' && values.length <= 0) {
                                    callback(valid.checkRequired_msg);
                                  } else {
                                    callback();
                                  }
                                }
                              }
                            ]}
                          >
                            <Select
                              mode="multiple"
                              optionFilterProp="children"
                              optionLabelProp="label"
                              filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={(value, option) => {
                                const tmpAry = form.getFieldValue().ui_replace_settle_record.slice();
                                let selectAry = tmpAry[idx]['ui_option_selected'] = [];

                                if (option.length > 0) {
                                  option.forEach(item => {
                                    let newObj = {
                                      contract_author_code: item.label,
                                      contract_author_id: item.value,
                                      contract_author_subcontract_code: null,
                                      contract_author_subcontract_id: item.subcontractid
                                    }
                                    selectAry.push(newObj)
                                  })
                                }
                                addIsEdit(idx);
                              }}
                            >
                              {
                                (contractAuthorIdOpt && contractAuthorIdOpt[idx])
                                  ? (
                                    contractAuthorIdOpt[idx].map(d => (
                                      <Option
                                        key={d.value}
                                        label={d.label}
                                        subcontractid={d.subcontract_id}
                                      >
                                        {d.label}
                                      </Option>
                                    ))
                                  )
                                  : ([])
                              }
                            </Select>
                          </Form.Item>
                        </td>
                        <td>{/*扣佣比例*/}
                          <Form.Item
                            {...field}
                            name={[field.name, 'percentage']}
                            fieldKey={[field.fieldKey, 'percentage']}
                            key={`percentage_${field.fieldKey}`}
                            initialValue=""
                            rules={[
                              {
                                validator(rule, values, callback) {
                                  let result = (form.getFieldValue().ui_replace_settle_record[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);
                                  if (result !== false) {
                                    callback();
                                  } else {
                                    callback(valid.checkRequired_msg)
                                  }
                                }
                              }
                            ]}
                          >
                            <InputNumber min="0" max="100" onChange={() => addIsEdit(idx)} />
                          </Form.Item>
                        </td>
                        <td>
                          <Tooltip title="清除">
                            <CloseOutlined
                              style={{ fontSize: '16px', marginTop: '10px' }}
                              className={styles.om_color_red}
                              onClick={() => {
                                if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                  // 清除 Author code
                                  let newAuthorCodeLabel = [...authorCodeLabel];
                                  newAuthorCodeLabel.splice(idx, 1);
                                  setAuthorCodeLabel(newAuthorCodeLabel);

                                  remove(field.name);
                                } else {
                                  let delArr = form.getFieldValue().ui_replace_settle_record.slice();
                                  delArr[idx]['is_delete'] = '1';
                                  if (delArr[idx]['is_edit']) {
                                    delete delArr[idx]['is_edit']
                                  }
                                  form.setFieldsValue({ ui_replace_settle_record: delArr });
                                }
                              }}
                            /></Tooltip>
                        </td>
                      </tr>)
                  })}
                  <tr className={styles.lastTr}>
                    <td colSpan="4">
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          新增
                        </Button>
                      </Form.Item>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          )
        }}
      </Form.List>
    </Fragment >
  )
}
export default ComRecord;
import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  Tooltip,
} from 'antd';
import { PlusOutlined, CloseOutlined, } from "@ant-design/icons";
import FormAuthorId from './FormAuthorId';
import valid from '@/fn/valid';
import styles from '@/style/style.less';

export const ComRight = props => {
  const {
    form,
    info,
    changeId,
    getErrorInfo,
  } = props;

  // author_id
  const [authorIdList, setAuthorIdLIst] = useState([]);
  const [authorCodeLabel, setAuthorCodeLabel] = useState([]);

  // updateData 
  useEffect(() => {
    // show author_code
    if (info && info.ui_replace_settle_right && info.ui_author_code_right) {

      const list = info.ui_replace_settle_right;
      let tmpOpt = [];
      for (let i = 0; i < list.length; i++) {
        tmpOpt.push([{
          id: list[i].author_id,
          name: list[i].author_name,
          author_code: list[i].author_code,
        }]);
      }

      setAuthorIdLIst(tmpOpt);
      setAuthorCodeLabel(info.ui_author_code_right);
    }
  }, [changeId]);

  function addIsEdit(idx) {
    let ary = form.getFieldsValue().ui_replace_settle_right.slice();
    if (ary[idx]['id']) {
      ary[idx]['is_edit'] = "1"
    }
  }
  return (
    <Fragment>
      <h4 style={{ fontWeight: 'bold' }}>詞曲</h4>
      <Form.List name="ui_replace_settle_right">
        {(fields, { add, remove }, { errors }) => {
          let arr = form.getFieldValue().ui_replace_settle_right;
          let num = 0;

          return (
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th>適用作者</th>
                  <th>扣佣比例(%)</th>
                  <th>預付設定</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              {(info && info.ui_replace_settle_right) && (
                <tbody>
                  {fields.map((field, idx) => {
                    if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                      num++;
                    }
                    return (
                      <tr
                        key={`ui_replace_settle_right_${field.key}`}
                        style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                      >
                        <td>
                          <FormAuthorId
                            form={form}
                            field={field}
                            idx={idx}
                            aryListName="ui_replace_settle_right"
                            isList={authorIdList}
                            setIsList={setAuthorIdLIst}
                            authorCodeLabel={authorCodeLabel}
                            setAuthorCodeLabel={setAuthorCodeLabel}
                          />
                        </td>
                        <td>
                          <Form.Item
                            {...field}
                            name={[field.name, 'percentage']}
                            fieldKey={[field.fieldKey, 'percentage']}
                            key={`percentage_${field.fieldKey}`}
                            initialValue=""
                            rules={[
                              {
                                validator(rule, values, callback) {
                                  let result = (form.getFieldValue().ui_replace_settle_right[idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

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
                          <Form.Item
                            {...field}
                            name={[field.name, 'no_commission']}
                            fieldKey={[field.fieldKey, 'no_commission']}
                            key={`no_commission_${field.fieldKey}`}
                            className={styles.om_dis_inlinebl}
                            initialValue={false}
                            valuePropName="checked"
                          >
                            <Checkbox onChange={() => addIsEdit(idx)}>不扣佣</Checkbox>
                          </Form.Item>
                        </td>
                        <td>
                          <Tooltip title="清除">
                            <CloseOutlined
                              style={{ fontSize: '16px', marginTop: '10px' }}
                              className={styles.om_color_red}
                              onClick={() => {
                                if (arr[idx] === undefined || arr[idx]['id'] === undefined) {  // 新增的資料
                                  // 清除 Author code
                                  let newAuthorCodeLabel = [...authorCodeLabel];
                                  newAuthorCodeLabel.splice(idx, 1);
                                  setAuthorCodeLabel(newAuthorCodeLabel);

                                  remove(field.name);
                                } else {
                                  let delArr = form.getFieldValue().ui_replace_settle_right.slice();
                                  delArr[idx]['is_delete'] = '1';
                                  if (delArr[idx]['is_edit']) {
                                    delete delArr[idx]['is_edit']
                                  }
                                  form.setFieldsValue({ ui_replace_settle_right: delArr });
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

export default ComRight;



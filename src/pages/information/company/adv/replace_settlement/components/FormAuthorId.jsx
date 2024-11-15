import React, { useState, Fragment } from 'react';
import {
  Form,
  Spin,
  Select,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const FormAuthorId = props => {
  const {
    form,
    field,
    isList,
    setIsList,
    authorCodeLabel,
    setAuthorCodeLabel,
    aryListName,
    idx,
    changeFn,  // optional
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/author/author_name', (res) => {
        let tmpIsList = isList.slice();
        tmpIsList[idx] = res;
        setIsList(tmpIsList);
        setIsFetching(false);
      });
    }, 200);
  }
  return (
    <Fragment>
      <Form.Item
        {...field}
        name={[field.name, 'author_id']}
        fieldKey={[field.fieldKey, 'author_id']}
        key={`author_id_${field.fieldKey}`}
        validateTrigger={['onClick', 'onBlur']}
        rules={[
          {
            validator(rule, values, callback) {
              let result = (form.getFieldValue()[aryListName][idx]['is_delete'] == '1') ? (true) : valid.checkRequired(values);

              if (result !== false) {
                callback();
              } else {
                callback(valid.checkRequired_msg)
              }
            }
          }
        ]}
      >
        <Select
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value, idx);
          }}
          onChange={(value, option) => {
            let arrAddEdit = form.getFieldsValue()[aryListName].slice();
            let tmpAuthorCodeLabel = authorCodeLabel.slice();
            if (!value) {
              tmpAuthorCodeLabel[idx] = '';
              arrAddEdit[idx]['author_name'] = '';
              arrAddEdit[idx]['author_code'] = '';
            } else {
              tmpAuthorCodeLabel[idx] = option.text;
              arrAddEdit[idx]['author_code'] = option.text;
              arrAddEdit[idx]['author_name'] = option.label;
              arrAddEdit[idx]['content'] = []

              if (arrAddEdit[idx]['id']) {
                arrAddEdit[idx]['is_edit'] = '1';
              }
            }

            // record value, option 清空
            if (changeFn) {
              arrAddEdit[idx]['ui_contract_author_id'] = [];
              changeFn((option && option.key) ? option.key : '', idx);
            }
            setAuthorCodeLabel(tmpAuthorCodeLabel);
            form.setFieldsValue({ [aryListName]: arrAddEdit });
          }}
          onFocus={() => {
            if (form.getFieldValue()[aryListName][idx] && form.getFieldValue()[aryListName][idx]['author_name']) {
              searchOption(form.getFieldValue()[aryListName][idx]['author_name'], idx);
            }
          }}
          onSelect={(value, option) => {
            searchOption(option.label, idx);
          }}
        >
          {
            (isList && isList[idx])
              ? (
                isList[idx].map(d => (
                  <Option
                    key={d.id}
                    label={d.name}
                    text={`${d.author_code}`}
                  >
                    {`${d.name} (${d.author_code})`}
                  </Option>
                ))
              )
              : ([])
          }
        </Select>
      </Form.Item>
      <label
        className={styles.searchLabel}
        style={{
          padding: '0',
          paddingRight: '10px',
          marginTop: '-15px'
        }}>
        {(authorCodeLabel && authorCodeLabel[idx]) ? `(${authorCodeLabel[idx]})` : ''}
      </label>
    </Fragment>
  )
}

export default FormAuthorId;
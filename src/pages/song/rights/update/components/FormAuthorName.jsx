import React, { useState, Fragment } from 'react';
import {
  Form,
  Select,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormAuthorName = props => {
  const {
    form,
    isLabel,
    isName,
    isSelectText,
    isList,
    setIsList,
    authorCodeLabel,
    setAuthorCodeLabel,
    setChangeStatus,
    updateAuthorPenNameList,
    updateContractList,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Author/author_name', (res) => {
        setIsList(res);
        setIsFetching(false);
      });
    }, 200);
  }

  const searchPenNameOption = (keyword) => {
    commFn.searchOption(keyword, '/Author/author_pen', (res) => {
      updateAuthorPenNameList(res, true);
    });
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
        rules={[
          { required: true, message: '此欄位為必填' }
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
            searchOption(value);
          }}
          onChange={(value, option) => {
            let obj = {};

            if (setChangeStatus) {
              setChangeStatus(true);
            }

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              // update contract_song_code
              obj['contract_song_code'] = '';
              form.setFieldsValue(obj);
              setAuthorCodeLabel(option.text);
              // update contractList
              updateContractList(option.authorid);
            } else {
              obj[isSelectText] = '';
              // update contract_song_code
              obj['contract_song_code'] = '';
              form.setFieldsValue(obj);
              setAuthorCodeLabel('');
              // update penname
              updateAuthorPenNameList([], true);
              // update contractList
              updateContractList();
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
            // update penname
            searchPenNameOption(option.value);
          }}
        >
          {(isList)
            ? (
              isList.map(d => (
                <Option
                  key={d.author_code}
                  label={d.name}
                  text={d.author_code}
                  authorid={d.id}
                >
                  {`${d.name} (${d.author_code})`}
                </Option>
              ))
            )
            : ([])
          }
        </Select>
      </Form.Item>
      <label className={styles.searchLabel}>{(authorCodeLabel) ? `(${authorCodeLabel})` : ''}</label>
    </Fragment >
  );
}

export default FormAuthorName;
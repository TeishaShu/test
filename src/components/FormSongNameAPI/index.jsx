import React, { Fragment, useState } from 'react';
import {
  Form,
  Select,
  Input,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormSongNameAPI = props => {
  const {
    form,
    isLabel,
    isName,
    isSelectText,
    isList,
    setIsList,
    codeLabel,
    setCodeLabel,
    isDisabled,  // optional
    changeFn,  // optional
    rules,  // optional
    hideCode,  // optional
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        setIsList(res);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
        rules={rules}
      >
        <Select
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          disabled={(isDisabled) ? (isDisabled) : false}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            let obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              form.setFieldsValue(obj);
              setCodeLabel(option.text);
            } else {
              obj[isSelectText] = '';
              form.setFieldsValue(obj);
              setCodeLabel('');
            }

            if (changeFn) {
              changeFn(option);
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.map(d => (
            <Option
              key={d.song_code}
              label={d.song_name}
              text={d.song_code}
              showtext={`${d.song_name} (${d.song_code})`}
              songid={d.id}
            >
              {`${d.song_name} (${d.song_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {
        (!hideCode) && (<label className={styles.searchLabel}>{(codeLabel) ? `(${codeLabel})` : ''}</label>)
      }
    </Fragment >
  );
}

export default FormSongNameAPI;
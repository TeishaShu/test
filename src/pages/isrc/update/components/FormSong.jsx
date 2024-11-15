import React, { Fragment, useState } from 'react';
import {
  Form,
  Select,
  Spin,
} from 'antd';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormSong = props => {
  const {
    form,
    isLabel,
    isName,  // db: song.id
    isSelectText,
    isList,
    setIsList,
    isCodeName,
    isDisabled,
    changeFn,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Song', (res) => {
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
              obj[isCodeName] = option.text;
              form.setFieldsValue(obj);

              if (changeFn) {
                changeFn(option);
              }
            } else {
              obj[isSelectText] = '';
              obj[isCodeName] = '';
              form.setFieldsValue(obj);
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
              key={d.id}
              label={d.song_name}
              text={d.song_code}
            >
              {`${d.song_name} (${d.song_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Fragment >
  );
}

export default FormSong;
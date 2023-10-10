import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import './App.css';
import { Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import AWSBedRockRuntime from 'aws-sdk/clients/bedrockruntime';
import { Buffer } from 'buffer';

function PromptText(props) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>User prompt</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          id="userPrompt"
          value={props.userPrompt}
          onChange={(e) => {
            props.onUserPromptChange(e.target.value);
          }}
        />
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

function PromptPreview(props) {
  if (props.loading) {
    return (
      <div class="spinner-container">
        <Spinner />
      </div>
    );
  }

  if (!props.data) {
    return null;
  }

  return (
    <div className="preview">
      <h4>Preview</h4>

      <div className="preview-container">
        <div dangerouslySetInnerHTML={{ __html: props.data }}></div>
      </div>
    </div>
  );
}

function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [data, setData] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  async function onUserPromptSubmit() {
    setData('');
    setDataLoading(true);

    const bedrockRuntime = new AWSBedRockRuntime({
      endpoint: 'bedrock-runtime.us-east-1.amazonaws.com',
      accessKeyId: 'ASIA3V7TIDNY5JLA6RCN',
      secretAccessKey: 'QqowVS/v5Rpi843sg8TX/xXXQFKDQtF7aCz2HSy2',
      sessionToken:
        'IQoJb3JpZ2luX2VjEMj//////////wEaCXVzLWVhc3QtMSJHMEUCIBzngEY9Mg0kZucm2HIZeBN58+BNDUEp7oaHLgxTIlOQAiEAhfbUQxgJoronMuCtBfocDu6GcDVfcz0qPnqtp0N0M6wqqAII0f//////////ARABGgw4MDMxMzIxNTI2ODkiDDyYMIe2OtsvCXTIiir8ARiXg5z5StII8Rztdo3aWXUBwO5J9MrUhPY/z44FXV8TDSVXeUm3f6jVED5a8rOmReAG3b9i9IinvSTouAAR3hREDT8P7W+LFSiLZlqOUxwYE3IMi0dIos/BtRXP2qUxmSZ7D0bTEhvPD75orgrV3TPAytRuZuqpGq+C5s6muRDuybgyagxTQZ28R8Pv2QfbvTFMp9HlXNkhVSfGkGqqWRZd2Ul26AElPTVdn2QN61Nbjghjxm+Q1oGIglnzzS+lxh22W/FB+XkYmKzjF96zhNJJwBC9x0JtYIGbDmXkzJLEiiyNxS6Yu9dXid5Ks2982cUqxMNLBukmSR98FzCo+JOpBjqdAePfxhLhRYXYzuwVMVdm2m+JHhtmDx/udhSTQyThgW1Qb6DIroahbIoKXIaBuImRmBTdAflr0euX8ovHLZKTVSuQDCUq0LgRRcPx9nCwh+lSQjfE/7H9N7cPyeAbm+GMEI8wjqiseYt8tqmkwkiyzt5fhoJo575tLiNvKgOOjmODGbIqY+4Uia5ofSyVgMUIZuSWTBLSenyVvi8BkPk=',
      region: 'us-east-1',
    });

    const endDecorator =  "Also remove all \n characters from output  \n\n. Remove all \"\" from the output. Also ignore all the spelling mistakes."
    const params = {
      body: JSON.stringify({
        prompt: `Human: ${userPrompt} ${endDecorator} Assistant:`,
        temperature: 0.5,
        top_p: 1,
        top_k: 250,
        max_tokens_to_sample: 8000,
        stop_sequences: ['test'],
      }),
      modelId: 'anthropic.claude-v2',
      accept: 'application/json',
      contentType: 'application/json',
    };

    bedrockRuntime.invokeModel(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        setDataLoading(false);
      } else {
        const bufferString = Buffer.from(data.body, 'hex').toString('utf8');
        const response = JSON.parse(bufferString);

        setData(response.completion.split('YUGI').slice(1, -1));
        setDataLoading(false);
      }
    });
  }

  return (
    <div className="app-container">
      <PromptText
        userPrompt={userPrompt}
        onUserPromptChange={setUserPrompt}
        onSubmit={onUserPromptSubmit}
      />

      <PromptPreview data={data} loading={dataLoading} />
    </div>
  );
}

export default App;

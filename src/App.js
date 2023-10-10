import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import './App.css';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

function getAmznDate() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  const xAmznDate = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;

  return xAmznDate;
}

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

function App() {
  const [userPrompt, setUserPrompt] = useState('');

  async function onUserPromptSubmit() {
    const myHeaders = new Headers();

    myHeaders.append('contentType', 'application/json');
    myHeaders.append(
      'X-Amz-Content-Sha256',
      'beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3'
    );
    myHeaders.append(
      'X-Amz-Security-Token',
      'IQoJb3JpZ2luX2VjEMb//////////wEaCXVzLWVhc3QtMSJHMEUCIQDsKDon4RYJmJWnIth7/+rtiIlzuXg5bT/O2f88zOTYBwIgWR8+l5TZbVdYlc/U+5mAryaxjZinsghdJk8mzSSjyX4qpwIIz///////////ARABGgw4MDMxMzIxNTI2ODkiDKnSVew+9ZsHALiynir7AfmBBAfZbGuySdmXeDRwTkIyurwM7tHjIJMyjnPwl5K+1P72i2g4sJ0aVkdoTH8djXCdgBcel2Wk8fO4DdyfTaKRc/sVAX4CRMXZQFV/11i73mMm35C/lggZHhkuUrerRjSgkjwefODDorBaYGDmu0a5mrdr36oG8ndX9ZSgxyp/KM8fUgvSAGfEtMOc6kbMXV0qU+LTfFcd30XvwKSUyydLixs0aHQz8eZCje9XwdOc45/T/EyDdw1tjQuKUuw2Tm1Gudv/ZjZSuLTxSBMCZi997sLbBBMdTvIkGGlyo7tT88ivFjmyqVFRpgrrhfnhbfSRhrIwiLnhKBO1MK7Hk6kGOp0BxmtB6w82RepOlbm75ZZkOLzt3X/34Vl3dS/xnZPuAojC8ZHGJFjsU1I/AbsETO/kXlJmMBONGQ/vHJ+ezeabQH4XirTloclQhZZXjxFapk7kT8JPdykdrNunTKKIjQ3uYXIoRXoUmjYJyxeAO0vj2W3MRzBeYjjLw9jvnKz83CxeFqUoEL3kOdMMR36G6s4p9s74Ts4WbGT3w6Vz1Q=='
    );
    myHeaders.append('X-Amz-Date', getAmznDate().toString());
    myHeaders.append(
      'Authorization',
      'AWS4-HMAC-SHA256 Credential=ASIA3V7TIDNY4MYHM672/20231010/us-east-1/bedrock/aws4_request, SignedHeaders=contenttype;host;x-amz-content-sha256;x-amz-date;x-amz-security-token, Signature=6566eb7d5b88534d66bf7ea4e41b481b47f009c50ca82c6aeac3c87439316b48'
    );
    myHeaders.append('Content-Type', 'application/json');

    const payload = JSON.stringify({
      prompt: userPrompt,
      temperature: 0.5,
      top_p: 1,
      top_k: 250,
      max_tokens_to_sample: 8000,
      stop_sequences: ['test'],
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow',
    };

    const res = await fetch(
      'https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke',
      requestOptions
    );
    const data = await res.json();

    console.log(data);
  }

  return (
    <div className="app-container">
      <PromptText
        userPrompt={userPrompt}
        onUserPromptChange={setUserPrompt}
        onSubmit={onUserPromptSubmit}
      />
    </div>
  );
}

export default App;

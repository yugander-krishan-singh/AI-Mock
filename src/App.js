import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import './App.css';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

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

  function onUserPromptSubmit() {
    console.log(userPrompt);
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

import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import App from '../App';
import axios from "axios";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("should have exported App Component", function () {
  expect(typeof (App)).toEqual("function");
});

test('Should have Journler branding in the app', () => {
  act(() => {
    render(<App />, container);
  });
  const brandingName = document.getElementById("journal-branding__title");
  expect(brandingName.textContent).toEqual("Journler");
});

test('Should be displaying the current date in the editor mode of the app', () => {
  act(() => {
    render(<App />, container);
  });
  const currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  const currentDateAsNumber = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  let todayDate = `${currentDateAsNumber} ${month} ${year}`;
  expect(document.getElementById("journal-editor__date")).toHaveTextContent(todayDate);
});

test('should have editor mode by default', () => {
  act(() => {
    render(<App />, container);
  });

  const inputElement = document.getElementsByTagName('input')[0].getAttribute('placeholder');
  expect(inputElement).toContain("What's on your Mind?");
});

test('should be a text box in the page in editor mode', () => {
  act(() => {
    render(<App />, container);
  });
  const inputElement = document.getElementsByTagName('input')[0].getAttribute('placeholder');
  expect(inputElement).toContain("What's on your Mind?");
});

test(`Expect textBox to be there in the Journal with placeholder I am all excited to know how was your day like!`, async () => {
  act(() => {
    render(<App />, container);
  });
  const inputElement = document.getElementsByTagName('textarea')[0].getAttribute('placeholder');
  expect(inputElement).toContain(
    `I am all excited to know how was your day like!`
  );
});

test('should have get call in useEffectHook for getting all journals',
  async () => {
    let response = {
      data: {
        "id": 1644215694059,
        "date": "7 February 2022",
        "title": "demo",
        "writeup": "just a test",
        "mood": "Excited"
      }
    };
    const getMock = jest.spyOn(axios, "get").mockImplementation((url) => Promise.resolve(response));
    act(() => {
      render(<App />, container);
    });

    expect(getMock).toHaveBeenCalled();
  });

test('should have post call in save journals',
  async () => {
    let response = {
      data: {
        "id": 1644215694059,
        "date": "7 February 2022",
        "title": "demo",
        "writeup": "just a test",
        "mood": "Excited"
      }
    };
    const saveMock = jest.spyOn(axios, "post").mockImplementation((url) => Promise.resolve(response));
    await act(async () => {
      render(<App />, container);
    });

    let saveButton = document.getElementById("save_button");
    await act(async () => {
      saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

test('saveJournals method should save data',
  async () => {
    let response = {
      data: {
        "id": 1644215694059,
        "date": "7 February 2022",
        "title": "demo",
        "writeup": "just a test",
        "mood": "Excited"
      }
    };
    const saveMock = jest.spyOn(axios, "post").mockImplementation((url) => Promise.resolve(response));
    act(() => {
      render(<App />, container);
    });
    
    let saveButton = document.getElementById("save_button")
    await act(async () => {
      saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    });

    let lengthOfList = document.getElementsByTagName('li').length;
    expect(lengthOfList).toBe(1);
    expect(saveMock).toHaveBeenCalled();
  });

test('Should have cancel method should clear form data',
  async () => {
    act(() => {
      render(<App />, container);
    });

    await act(async () => {
      document.getElementById("cancel_button").dispatchEvent(new MouseEvent('click', { bubbles: true }))
    });

    expect(document.getElementById("journal-editor__title-editor").value).toBe('');
  });

test('should be a delete and edit button after click of the journal', async () => {
  let response = {
    data: {
      "id": 1644215694059,
      "date": "7 February 2022",
      "title": "demo",
      "writeup": "just a test",
      "mood": "Excited"
    }
  };
const saveMock = jest.spyOn(axios, "post").mockImplementation((url) => Promise.resolve(response));
  act(() => {
    render(<App />, container);
  });
  
  let saveButton = document.getElementById("save_button");
  await act(async () => {
    saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  });

  await act(async () => {
    document.getElementsByTagName('li')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  });

  let editButton = document.getElementById("edit_button");
  let deleteButton = document.getElementById("delete_button");

  expect(editButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();
});

test('should have delete call in the delete journal method', async () => {

  let response = {
    data: {
      "id": 1644215694059,
      "date": "7 February 2022",
      "title": "demo",
      "writeup": "just a test",
      "mood": "Excited"
    }
  };
  jest.spyOn(axios, "post").mockImplementation((url,data) => Promise.resolve(response));

  await act(async () => {
    render(<App />, container);
  });

  let saveButton = document.getElementById("save_button");
  await act(async () => {
    saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  await act(async () => {
    document.getElementsByTagName('li')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  })


  const deleteMock = jest.spyOn(axios, "delete").mockImplementation((url) => Promise.resolve(response));

  await act(async () => {
    document.getElementById("delete_button").dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(deleteMock).toHaveBeenCalled();
  expect(document.getElementsByTagName('li').length).toBe(0);
});

test('should have change mode and props, if edit button is clicked', async () => {

  let response = {
    data: {
      "id": 1644215694059,
      "date": "7 February 2022",
      "title": "demo",
      "writeup": "just a test",
      "mood": "Excited"
    }
  };
  jest.spyOn(axios, "post").mockImplementation((url,data) => Promise.resolve(response));
  await act(async() => {
    render(<App />, container);
  });

  let saveButton = document.getElementById("save_button");
  await act(async () => {
    saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  })

  await act(async () => {
    document.getElementsByTagName('li')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  await act(async () => {
    document.getElementById("edit_button").dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  let documentTitle = document.getElementById("journal-editor__title-editor").value;

  expect(documentTitle).toContain("demo");
});

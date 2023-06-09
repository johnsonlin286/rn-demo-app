import API from "./config";

export const signup = async (name: string, email: string, password: string) => {
  const reqbody = {
    query: `
      mutation signin($name: String!, $email: String!, $password: String!) {
        signup(userInput: {name: $name, email: $email, password: $password}), {
          _id name email
        }
      }
    `,
    variables: {
      name: name,
      email: email,
      password: password,
    },
  };
  return await API(reqbody)
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

export const signin = async (email: string, password: string) => {
  const reqbody = {
    query: `
        query Signin($email: String!, $password: String!) {
          signin(email: $email, password: $password), {
            _id name email token
          }
        }
      `,
    variables: {
      email: email,
      password: password,
    },
  };
  return await API(reqbody)
    .then((response: any) => {
      return response;
    })
    .catch((error) => {
      return {
        error: error.response,
      };
    });
};

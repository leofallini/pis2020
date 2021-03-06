# Documentación técnica y otra información relevante

## Índice

- [Introducción](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#introducci%C3%B3n)
- [Funcionalidades del componente SDK](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidades-del-componente-sdk)
  - [Funcionalidad de *login*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidad-de-login)
  - [Funcionalidad de *getToken*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidad-de-gettoken)
  - [Funcionalidad de *refreshToken*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidad-de-refreshtoken)
  - [Funcionalidad de *getUserInfo*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidad-de-getuserinfo)
  - [Funcionalidad de *logout*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#funcionalidad-de-logout)
- [Ejecución de pruebas unitarias y *linter*](https://github.com/elirosselli/pis2020/tree/develop/sdk/CONTRIBUTING.md#ejecuci%C3%B3n-de-pruebas-unitarias-y-linter)

## Introducción

Este documento presenta documentación técnica detallada sobre la implementación de las funcionalidades del sdk y los módulos que lo componen. También se incluyen instrucciones para poder ejecutar las pruebas unitarias y el analizador estático de código (*linter*).

## Funcionalidades del componente SDK

Esta sección presenta las funcionalidades brindadas por el componente SDK. Para cada funcionalidad se explica su utilidad y la forma en la que se encuentra implementada. Puede resultar útil para aquellos desarrolladores que busquen entender con mayor detalle el funcionamiento del componente y realizar modificaciones.

### Funcionalidad de *login*

#### Generalidades

La funcionalidad de **login** se encarga de autenticar al usuario final directamente ante el OP para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del **login** consiste en una función que devuelve una [promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas). Para esto, primero se envía un *Authentication Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda validar al RP. Los parámetros obligatorios enviados son: *scope*, *response_type*, *client_id* y *redirect_uri*.

Para validar al RP, el OP verifica que el *client_id* y *redirect_uri* enviados en la *Authentication Request* coinciden con los generados al momento del [registro](https://centroderecursos.agesic.gub.uy/web/seguridad/wiki/-/wiki/Main/ID+Uruguay+-+Integración+con+OpenID+Connect) del RP ante el OP. Una vez que el RP es validado, el usuario final puede realizar el proceso de autenticación y autorización directamente ante el OP a través del navegador web. En este proceso se deben ingresar las credenciales de Usuario gub.uy y autorizar al RP al acceso a los datos solicitados. Cuando esta acción finaliza el usuario final debe confirmar para volver a la aplicación.

En caso de éxito, es decir que la RP sea validada ante el OP y el usuario final realice el proceso de autorización y autenticación correctamente, la función de **login** devuelve el parámetro *code*. En caso contrario, ya sea porque no se pudo autenticar al RP, porque el usuario final no autoriza a la aplicación o porque no se puede realizar el *request*, se retorna una descripción acorde al error ocurrido.

#### Archivos y parámetros

La implementación de la funcionalidad de *login* involucra los siguientes archivos:

- **sdk/requests/logout.js**: Donde se implementa la función **login**. Esta función se encarga de realizar el *Login Request*.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **login**.
- **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
- **sdk/configuration/index.js**: Módulo de configuración de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes a utilizar.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **login** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en el *request* a través del módulo de configuración y retorna una promesa. Cuando se resuelve dicha promesa se obtiene el *code*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función de **login** es declarada como una función asincrónica de la siguiente manera:

```javascript
const login = async () => {
```

El fin de la función [*async*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/funcion_asincrona) es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque [*try*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), se declara un [*Event Listener*](https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener) que escuchará por eventos del tipo '*url*', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza [Linking](https://reactnative.dev/docs/linking). Esto se puede ver en la siguiente línea:

```javascript
Linking.addEventListener('url', handleOpenUrl);
```

En este punto se tiene un *Event Listener* que queda esperando por un evento del tipo '*url*'. Luego, se verifica que los parámetros necesarios para realizar la autenticación se encuentren ya definidos en el módulo de configuración. Si alguno de estos parámetros no se encuentra inicializado, se rechaza la promesa con un mensaje de error correspondiente. Por otro lado, si se encuentran inicializados, la función intentaabrir el navegador con la *url* deseada para enviar al *Login Endpoint*. Esta *url* contendrá el *client_id*, la *redirect_uri* y opcionalmente *state*. Esto se puede ver a continuación:

```javascript
Linking.openURL(loginEndpoint())
```

Donde *loginEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

```javascript
https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}
```

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el *browser* o no. Luego, el usuario final ingresa sus credenciales y decide si confirmar el acceso por parte de la aplicación a los datos solicitados.

Una vez realizado el *request* se retorna un *response* que corresponde con un HTTP *redirect* a la *redirect_uri*, lo cual es detectado por el *Event Listener* como un evento *url*. Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito contiene el *code* y en caso contrario un error correspondiente.

Adicionalmente, se intenta obtener el *code* a través de una expresión regular. En caso de encontrarse, se resuelve la promesa retornando dicho parámetro. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **login** también se encuentra un bloque [*catch*](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch), que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.

### Funcionalidad de *getToken*

#### Generalidades

La función **getToken** se encarga de la comunicación entre la aplicación de usuario y el *Token Endpoint*, de forma de obtener los datos correspondientes a un Token Request. El objetivo principal de esta función es obtener un *token* para posteriormente utilizarlo con el fin de adquirir información del usuario final previamente autenticado. Por ende, esta función depende del *code* obtenido en la función **login**, además de requerir los datos de autenticación del usuario (*client_id* y *client_secret*), y la *redirect_uri* correspondiente. A partir de estos datos se realiza una consulta *Token Request* con el método POST al *Token Endpoint*.

Como resultado de la solicitud se obtiene un *Token Response* conteniendo los parámetros correspondientes. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al RP un código y descripción acorde al error ocurrido.

#### Archivos y parámetros

La implementación de la funcionalidad de **getToken** se encuentra implementada en la función **getTokenOrRefresh**, ya que su implementación es compartida con la funcionaldiad de **refreshToken**. La misma involucra los siguientes archivos:

- **sdk/requests/getTokenOrRefresh.js**: Donde se implementan las funcionalidades de **getToken** y **refreshToken**.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca a **getTokenOrRefresh**.
- **sdk/interfaces/index.js**: Donde se invoca la función **makeRequest** y se implementa la función de **getToken**.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes necesarias.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **getTokenOrRefresh** recibe un solo parámetro, que indica si el request solicitado es del tipo **getToken** o **refreshToken**, y obtiene el resto de los parámetros necesarios a través del módulo de configuración. La función retorna una promesa, que cuando se resuelve retorna el *access_token*. En caso contrario, cuando se rechaza la promesa, se retorna un código y descripción indicando el error correspondiente.

#### Código

La función **getTokenOrRefresh** en el caso de la funcionalidad de **getToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_TOKEN, indicando que es un *request* del tipo *getToken*. Esta última, recibe como único parámetro el tipo de *request*. Por lo tanto, la función toma los parámetros del componente configuración, que van a ser utilizados a la hora de realizar la solicitud.

Se utiliza la librería [base-64](https://github.com/mathiasbynens/base64) para codificar el *client_id* y el *client_secret* siguiendo el esquema de autenticación [HTTP Basic Auth](https://tools.ietf.org/html/rfc7617). A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *Token Endpoint*. Ante un error en la solicitud se entra al bloque *catch* y se retorna el error correspondiente.

 En caso de obtenerse una respuesta y que la misma sea exitosa, se *setean* los parámetros recibidos en el componente configuración, con la función **setParameters** y se resuelve la promesa con el valor correspondiente al *access_token*. En caso de error, se rechaza la promesa devolviendo el error recibido.

### Funcionalidad de *refreshToken*

#### Generalidades

La función **refreshToken** se encarga de obtener un nuevo *token*, cuando un *token* obtenido anteriormente se vuelve inválido o cuando simplemente se desea obtener uno nuevo. Por ende, esta función depende del *token* obtenido en la función **getToken**. A partir de este dato se realiza una consulta *Refresh Token Request* con el método POST al *Token Endpoint*.

Como resultado de la solicitud se obtiene un *Refresh Token Response* conteniendo los parámetros correspondientes, que serán los mismos que en un *Token Response*. En caso de éxito, los valores de estos parámetros son almacenados en el componente de configuración, y la función retorna el *access_token* generado. En caso contrario, se retorna al RP un código y descripción acorde al error ocurrido.

#### Archivos y Parámetros

La implementación de la funcionalidad de **refreshToken** involucra los mismos archivos y mismos parámetros que **getToken**, ya que sus funcionalidades se encuentran implementadas en la misma función.

#### Código

La función **getTokenOrRefresh** en el caso de la funcionalidad de **refreshToken** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_REFRESH_TOKEN, indicando que es un *request* del tipo *refreshToken*. Luego, dentro de **makeRequest**, las implementaciones de **getToken** y **refreshToken** serán la misma, a diferencia del *body* de la solicitud *fetch*. En el caso de la funcionalidad **refreshToken**, el *body* solo necesita del *grant\_type* mencionado en *Refresh Token Request Params* y el *refresh_token* obtenido anteriormente a través de **getToken**.

### Funcionalidad de *getUserInfo*

#### Generalidades

La función **getUserInfo** se encarga de la comunicación entre la aplicación de usuario y el *User Info Endpoint*, de forma de obtener los datos correspondientes al usuario final *logueado*. Por ende, esta función depende del *access_token* obtenido en la función **getToken**, de manera de realizar mediante el método GET, un pedido al *User Info Endpoint*. La información del usuario final devuelta por la función, dependerá del *scope* seteado al realizar el **login**. Dicha información será devuelta en formato JSON.

#### Archivos y parámetros

La implementación de la funcionalidad de *getUserInfo* involucra los siguientes archivos:

- **sdk/requests/getUserInfo.js**: Donde se implementa la función **getUserInfo**. Esta función se encarga de realizar la *GetUserInfo Request*.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **getUserInfo**.
- **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen el *access_token* necesario.
- **sdk/utils/constants.js**: Contiene las constantes a utilizar.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **getUserInfo** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en el *request* a través del módulo de configuración. La función retorna una promesa, que cuando se resuelve retorna un objecto en formato JSON correpondiente a la información del usuario final según los *scopes* definidos. En caso contrario, cuando se rechaza la promesa, se retorna un código y descripción indicando el error correspondiente.

A continuación se presentará una lista con ejemplos de posibles valores de retorno de la función *getUserInfo* en función de los distintos scopes seteados.

Scope: openId:

```javascript
{
  sub: '5968',
}
```

Scope: openId y profile:

```javascript
{
  name: 'Clark Jose Kent Gonzalez',
  given_name: 'Clark Jose',
  family_name: 'Kent Gonzalez',
  sub: "5869",
}
```

Scope: openId y email:

```javascript
{
  email: 'kentprueba@gmail.com',
  email_verified: true,
  sub: "5869",
}
```

Scope: openId y auth_info:

```javascript
{
  ae: "urn:uce:ae:1",
  nid: "urn:uce:nid:1",
  rid: "urn:uce:rid:1",
  sub: "5869",
}
```

Scope: openId y document:

```javascript
{
  pais_documento: { codigo: 'uy', nombre: 'Uruguay' },
  tipo_documento: { codigo: 68909, nombre: 'C.I.' },
  numero_documento: '12345678',
  sub: "5869",
}
```

Scope: openId y personal_info:

```javascript
{
  nombre_completo: 'Clark Jose Kent Gonzalez',
  primer_apellido: 'Kent',
  primer_nombre: 'Clark',
  segundo_apellido: 'Gonzalez',
  segundo_nombre: 'Jose',
  sub: '5968',
  uid: 'uy-cid-12345678',
}
```

Scope: Todos los scopes:

```javascript
{
  sub: '5968',
  name: 'Clark Jose Kent Gonzalez',
  given_name: 'Clark Jose',
  family_name: 'Kent Gonzalez',
  nickname: 'uy-ci-12345678',
  email: 'kentprueba@gmail.com',
  email_verified: true,
  nombre_completo: 'Clark Jose Kent Gonzalez',
  primer_nombre: 'Clark',
  segundo_nombre: 'Jose',
  primer_apellido: 'Kent',
  segundo_apellido: 'Gonzalez',
  uid: 'uy-ci-12345678',
  pais_documento: { codigo: 'uy', nombre: 'Uruguay' },
  tipo_documento: { codigo: 68909, nombre: 'C.I.' },
  numero_documento: '12345678',
  ae: 'urn:uce:ae:1',
  nid: "urn:uce:nid:1",
  rid: "urn:uce:rid:1",
}
```

#### Código

La función de **getUserInfo** es declarada como una función asincrónica de la siguiente manera:

```javascript
const getUserInfo = async () => {
```

La función **getUserInfo** invoca a la función **makeRequest** con el parámetro REQUEST_TYPES.GET_USER_INFO, indicando que es un *request* del tipo *getUserInfo*. Luego, dentro de **makeRequest**, se realiza la request como se mencionó previamente.
A continuación se arma la solicitud, mediante la función `fetch` y se procede a su envío. Utilizando la función de sincronismos `await` se espera una posible respuesta por parte del *getUserInfo Endpoint*.

En el cuerpo de la función de **getUserInfo** se encuentra un bloque de try y uno de catch. Con esto se logra que si la función se ejecuta de forma satisfactoria se retorna la promesa con los valores explicados anteriormente. De lo contrario se la rechaza devolviendo un codigo de error y una descripción del mismo.

### Funcionalidad de *logout*

#### Generalidades

La funcionalidad de *logout* se encarga de cerrar la sesión del usuario final en el OP para lo cual se utiliza el navegador web del dispositivo móvil. El funcionamiento general del *logout* consiste en una función que devuelve una promesa. Para esto, primero se envía un *Logout Request* al OP a través del navegador web, donde se incluyen los parámetros necesarios para que el OP pueda efectuar el cierre de sesión. Los parámetros obligatorios enviados son: *id_token_hint* y *post_logout_redirect_uri*. El primero se corresponde con el *id_token* obtenido en la última *Get Token Request* o *Refresh Token Request*, mientras que el segundo se corresponde con la dirección a la cual el RP espera que se redireccione al usuario final una vez finalizado el proceso de cierre de sesión. Esta dirección deberá coincidir con la provista al momento del registro del RP ante el OP. Además de los parámetros obligatorios se tiene la opción de brindar el parámetro opcional *state*.

En caso de que los parámetros sean los correctos, la función de **logout** redirecciona al usuario final a la aplicación del RP, y si corresponde, devuelve el parámetro *state*. En caso contrario, se retorna una descripción acorde al error ocurrido.

#### Archivos y parámetros

La implementación de la funcionalidad de *logout* involucra los siguientes archivos:

- **sdk/requests/logout.js**: Donde se implementa la función **logout**. Esta función se encarga de realizar la *Logout Request*.
- **sdk/requests/index.js**: Donde se implementa la función **makeRequest**. Esta función invoca la función **logout**.
- **sdk/interfaces/index.js**: Donde se invoca la función de **makeRequest**.
- **sdk/configuration/index.js**: Módulo de configuración, de dónde se obtienen los parámetros necesarios.
- **sdk/utils/constants.js**: Contiene las constantes a utilizar.
- **sdk/utils/endpoints.js**: Contiene los *endpoints* a utilizar. Se obtienen los parámetros necesarios para realizar las *requests* invocando la función **getParameters** definida en el módulo de configuración.

La función **logout** no recibe parámetros, sino que obtiene los parámetros necesarios a utilizar en la *request* a través del módulo de configuración, en la función **logoutEndpoint** definida en el archivo de *endpoints* previamente mencionado, y retorna una promesa. Cuando se resuelve dicha promesa se obtiene un código y descripción indicando que la operación resultó exitosa, y si corresponde el parámetro *state*. En caso contrario, cuando se rechaza la promesa se retorna un código y descripción indicando el error correspondiente.

#### Código

La función de **logout** es declarada como una función asincrónica de la siguiente manera:

```javascript
const logout = async () => {
```

El fin de la función *async* es simplificar el uso de promesas. Esta función devolverá una promesa llamada *promise*, la cual es creada al principio del código. En el cuerpo de la función, dentro del bloque *try*, se declara un *Event Listener* que escucha por eventos del tipo '*url*', y ejecutará la función **handleOpenUrl** en caso de un evento de este tipo. Para poder interactuar con el *browser*, se utiliza linking. Esto se puede ver en la siguiente línea:

```javascript
Linking.addEventListener('url', handleOpenUrl);
```

En este punto se tiene un *Event Listener* que queda esperando por un evento del tipo *url*. Luego, se verifica que los parámetros necesarios para realizar el cierre de sesión se encuentren ya definidos en el módulo de configuración. Si alguno de estos parámetros no se encuentra inicializado, se rechaza la promesa con un mensaje de error correspondiente. Por otro lado, si se encuentran inicializados, la función intenta abrir el navegador con la *url* deseada para enviar al *Logout Endpoint*. Esta *url* contendrá el *id_token_hint*, el *post_logout_redirect_uri*, y opcionalmente *state*. Esto se puede ver a continuación

```javascript
Linking.openURL(logoutEndpoint())
```

Donde *logoutEndpoint* se encuentra en el archivo *endpoints.js*, con el siguiente valor:

```javascript
https://auth-testing.iduruguay.gub.uy/oidc/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirectUri}&state=${state}
```

Al abrir el *browser*, *Linking.openURL* devuelve una promesa, que se resuelve apenas se abre el browser o no.

Una vez realizado el request se retorna un *response* que corresponde con un HTTP *redirect* a la *post_logout_redirect_uri*, lo cual es detectado por el *Event Listener* como un evento *url*. Esto es visible para el usuario final a través de un mensaje desplegado en el *browser* que pregunta si desea volver a la aplicación. Luego, se ejecuta la función **handleOpenUrl**, donde el evento capturado es un objeto que tiene *key url* y *value* un *string*. Este *value* será la *url* que en caso de éxito es la *post_logout_redirect_uri* (con *state* como parámetro si corresponde) y en caso contrario un error correspondiente.

En caso que la *url* retornada sea efectivamente dicha URI, se resuelve la promesa. En caso contrario se rechaza la promesa, con un mensaje de error correspondiente. Finalmente, se remueve el *Event Listener* para no seguir pendiente por más eventos. En el cuerpo de la función de **logout** también se encuentra un bloque *catch*, que en caso de error remueve el *Event Listener*, rechaza la promesa y devuelve un mensaje de error acorde.

## Ejecución de pruebas unitarias y *linter*

Los comandos explicados a continuación se encuentran definidos en el archivo `package.json`, en la sección *scripts*.

### Pruebas unitarias

Para ejecutar las pruebas unitarias, se deberá ejecutar el siguiente comando dentro de la carpeta /sdk:

`npm run test`

Además, se puede obtener el cubrimiento (*coverage*) de las pruebas unitarias ejecutando el siguiente comando:

`npm run testCoverage`

Se observa que este comando también ejecuta las pruebas unitarias y devuelve sus resultados, devolviendo además los porcentajes de cubrimiento para los criterios de cubrimiento definidos.

### *Linter*

Para ejecutar el *linter* se deberá ejecutar el siguiente comando dentro de la carpeta /sdk:

`npm run linter`

Las reglas que aplica el *linter* se encuentran definidas en los archivos `.eslintrc.json` y `.prettierrc.js`.

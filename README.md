# Stevedore
Stevedore is a proxy for docker daemon. The value that tries to add is: provide configurable authentication mechanism that allows to authorize or authenticate the submitted request.

Stevedore is agnostic from the docker version that sits behind it and does not modify
the request/response data. Meaning that, taking apart the /stevedore/ prefix, the
APIs the specifications defined for the docker version in use will apply in full.

Stevedore allows as well defining, using configuration, a whitelist for endpoints that does not need to be subject to authorization or authentication.

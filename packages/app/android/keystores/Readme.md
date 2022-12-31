# convert jks to keystore

keytool -importkeystore -srckeystore release.jks -destkeystore release.keystore -srcstorepass bdz035Iq -deststorepass bdz035Iq


keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000


# generate sha1

keytool -list -v -keystore release.keystore -alias key0



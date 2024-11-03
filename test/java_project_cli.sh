mvn archetype:generate -DgroupId=com.example -DartifactId=projectName -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

mvn compile 

mvn exec:java -Dexec.mainClass="com.example.App"
import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "FA2"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    "com.googlecode.json-simple" % "json-simple" % "1.1.1",
    // Add your project dependencies here,
    javaCore,
    javaJdbc,
    javaEbean
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}

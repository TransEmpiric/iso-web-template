package com.transempiric.webTemplate;

import com.transempiric.simpleEncryptor.SimpleEncryptorFactoryBean;
import com.transempiric.simpleEncryptor.property.SimpleEncryptorEnvironment;
import com.transempiric.simpleEncryptor.property.SimpleEncryptorInterceptionMode;
import com.transempiric.simpleEncryptor.property.SimpleEncryptorPropertyResolver;
import com.transempiric.webTemplate.config.property.PropertyInitializer;
import com.transempiric.webTemplate.config.property.SysProp;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.encrypt.TextEncryptor;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.transempiric.webTemplate.config.web",
        "com.transempiric.webTemplate.config.security",
        "com.transempiric.webTemplate.config.jpa",
        "com.transempiric.webTemplate.config.loader",
        "com.transempiric.webTemplate.config.task",
        "com.transempiric.webTemplate.viewState",
        "com.transempiric.webTemplate.service",
        "com.transempiric.webTemplate.api",
        "com.transempiric.webTemplate.web",
})
public class WebTemplateApplication {
    public static void main(String[] args) throws Exception {
        TextEncryptor rsaDecryptor = new SimpleEncryptorFactoryBean()
                .rsaDecryptor("classpath:config/" + SysProp.get().env() + "/dev_enc_private_key.pem")
                .createInstance();

        //TODO: Clean up and make use of the SimpleEncryptorFactoryBean.
        SimpleEncryptorPropertyResolver resolver = new SimpleEncryptorPropertyResolver(rsaDecryptor);
        SimpleEncryptorEnvironment simpleEncryptorEnvironment = new SimpleEncryptorEnvironment(SimpleEncryptorInterceptionMode.WRAPPER, resolver);

        new SpringApplicationBuilder()
                .initializers(new PropertyInitializer())
                .environment(simpleEncryptorEnvironment)
                .sources(WebTemplateApplication.class).run(args);
    }

/*    @Bean
    public SpringTransMigrationFactory springTransMigration(DataSource dataSource) {
        SpringTransMigrationFactory springTransMigration = new SpringTransMigrationFactory(dataSource);

        //  Let it run
        springTransMigration.setShouldRun(true);

        // Should be set the current system environment
        // or left unset to run on test, prod, etc...
        springTransMigration.setTransMigrationContext("local");

        // Builds path to current Tags TransMigration Scripts
        springTransMigration.setTransMigrationRoot("classpath:upgrades/");
        springTransMigration.setTransMigrationTagPrefix("branch");
        springTransMigration.setTransMigrationTag("1");
        springTransMigration.setTransMigrationTagSuffix("/migration");

        // If you are using a Hibernate Session Factory Bean
        // defaults to false
        springTransMigration.setUseHibernateSessionFactory(true);

        // If you name your Hibernate SessionFactoryBean something funky
        // defaults to "sessionFactory"
        springTransMigration.setHibernateSessionFactoryBeanName("funkyBean");

        // springTransMigration.setScriptBeanAnnotations("");

        // Import Dependencies for the Groovy Scripts as needed.
        springTransMigration.setAdditionalScriptImports(new String[] {
                "com.transempiric.webTemplate.model",
                "com.transempiric.webTemplate.repository",
                "com.transempiric.webTemplate.service",
        });

        // Add some dependency injection to the Groovy Scripts as needed.
        springTransMigration.setScriptBeanNames(new String[] { "userRepository" });

        // springTransMigration.setScriptBeanAnnotations("");

        return springTransMigration;
    }*/
}
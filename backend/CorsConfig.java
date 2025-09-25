import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Global CORS Configuration (For broader application-wide settings)
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // This line adds a CORS mapping to all endpoints in your API.
                // The "/**" is a wildcard that matches any URL path.
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080") 
                        // This specifies the HTTP methods allowed for cross-origin requests.
                        // Included the most common RESTful methods: GET, POST, PUT, DELETE, and PATCH
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        // Allows all headers, including Content-Type and Authorization
                        .allowedHeaders("*") 
                        // This allows the browser to send credentials (like cookies and HTTP authentication)
                        // This might not be necessary 
                        .allowCredentials(true);
            }
        };
    }
}
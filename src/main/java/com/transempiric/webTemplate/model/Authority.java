package com.transempiric.webTemplate.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "authority")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Authority implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "authorities_privileges",
            joinColumns = @JoinColumn(
                    name = "authority_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "privilege_id", referencedColumnName = "id"))
    private Collection<Privilege> privileges;

    public Authority() {
        super();
    }

    public Authority(final String name) {
        super();
        this.name = name;
    }

    public Authority(String name,
                     //Collection<User> users,
                     Collection<Privilege> privileges) {
        this.name = name;
        //this.users = users;
        this.privileges = privileges;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Collection<Privilege> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Collection<Privilege> privileges) {
        this.privileges = privileges;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (obj.toString().equals(this.name)) {
            return true;
        }

        if (getClass() != obj.getClass()) {
            return false;
        }

        final Authority auth = (Authority) obj;
        if (this.name != null && this.name.equals(auth.name)) {
            return true;
        }

        return false;
    }

    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("Role [name=").append(name).append("]").append("[id=").append(id).append("]");
        return builder.toString();
    }

    @Override
    @JsonIgnore
    public String getAuthority() {
        return name;
    }
}

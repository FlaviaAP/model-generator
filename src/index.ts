import { JavaStringBootGenerator } from "./backend/spring-boot/java-spring-boot-generator";

function main() {
    new JavaStringBootGenerator(
        '',
        'NovaEntidade', 'Integer',
        'DatabaseMetadata.SCHEMA',
        'novas-entidades',
        true,
        true
    ).generateAll();
}

main();

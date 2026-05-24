import MDXComponents from '@theme-original/MDXComponents';
import Quiz, {Question} from '@site/src/components/Quiz';

/**
 * Register components that should be available in every MDX file
 * without an explicit import statement.
 */
export default {
  ...MDXComponents,
  Quiz,
  Question,
};
